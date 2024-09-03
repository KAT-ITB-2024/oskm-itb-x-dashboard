// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)

import {
  assignments,
  notifications,
  assignmentTypeEnum,
  assignmentSubmissions,
  groups,
  profiles,
  users,
  roleEnum,
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  eq,
  and,
  inArray,
  asc,
  or,
  ilike,
  count,
  desc,
  sum,
} from "drizzle-orm";
import { calculateOverDueTime } from "~/utils/dateUtils";
import {
  createTRPCRouter,
  mametProcedure,
  mentorProcedure,
  mentorMametProcedure,
} from "~/server/api/trpc";

export type MenteeAssignment = {
  nama: string;
  nim: string;
  keterlambatan: number | null;
  nilai: number;
  linkFile: string | null;
  assignmentSubmissions: {
    nama: string;
    nim: string;
    nilai: number;
    linkFile: string;
    updatedAt: Date;
    deadline: Date;
    assignmentsId: string;
  } | null;
};

export const assignmentRouter = createTRPCRouter({
  getAssignmentDetail: mentorMametProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { assignmentId } = input;

        const [assignment] = await ctx.db
          .select({
            assignmentId: assignments.id,
            judulTugas: assignments.title,
            waktuMulai: assignments.startTime,
            waktuSelesai: assignments.deadline,
            deskripsi: assignments.description,
            assignmentType: assignments.assignmentType,
            point: assignments.point,
            filename: assignments.filename,
            downloadUrl: assignments.downloadUrl,
          })
          .from(assignments)
          .where(eq(assignments.id, assignmentId));

        if (!assignment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
          });
        }

        return {
          data: assignment,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when fetching assignment detail",
        });
      }
    }),

  getMenteeAssignmentSubmission: mentorProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        mentorNim: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
        searchString: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { assignmentId, mentorNim, page, pageSize, searchString } = input;

        const groupName =
          (
            await ctx.db
              .select({
                groupName: profiles.group,
              })
              .from(profiles)
              .where(eq(users.nim, mentorNim))
              .innerJoin(users, eq(users.id, profiles.userId))
          )[0]?.groupName ?? "";

        const offset = (page - 1) * pageSize;

        const allMentee = await ctx.db
          .select({
            nama: profiles.name,
            nim: users.nim,
          })
          .from(profiles)
          .innerJoin(users, eq(users.id, profiles.userId))
          .where(
            and(
              eq(profiles.group, groupName),
              eq(users.role, roleEnum.enumValues[0]),
              or(
                ilike(profiles.name, `%${searchString}%`),
                ilike(users.nim, `%${searchString}%`),
              ),
            ),
          )
          .orderBy(asc(users.nim))
          .offset(offset)
          .limit(pageSize);

        const countRows = (
          await ctx.db
            .select({
              count: count(),
            })
            .from(profiles)
            .innerJoin(users, eq(users.id, profiles.userId))
            .where(
              and(
                eq(profiles.group, groupName),
                or(
                  ilike(profiles.name, `%${searchString}%`),
                  ilike(users.nim, `%${searchString}%`),
                ),
              ),
            )
        )[0] ?? { count: 0 };

        if (allMentee.length === 0) {
          return {
            data: [],
            meta: {
              totalCount: countRows.count,
              page,
              pageSize,
              totalPages: Math.ceil(countRows.count / pageSize),
            },
          };
        }

        const menteeNims = allMentee.map((mentee) => mentee.nim);

        // Retrieve all necessary assignment submission details
        const submissions = await ctx.db
          .select({
            nama: profiles.name,
            nim: users.nim,
            nilai: assignmentSubmissions.point,
            linkFile: assignmentSubmissions.downloadUrl,
            updatedAt: assignmentSubmissions.updatedAt,
            deadline: assignments.deadline,
            assignmentsId: assignmentSubmissions.assignmentId,
          })
          .from(assignmentSubmissions)
          .innerJoin(users, eq(assignmentSubmissions.userNim, users.nim))
          .innerJoin(profiles, eq(users.id, profiles.userId))
          .innerJoin(
            assignments,
            eq(assignmentSubmissions.assignmentId, assignments.id),
          )
          .where(
            and(
              eq(assignmentSubmissions.assignmentId, assignmentId),
              eq(users.nim, assignmentSubmissions.userNim),
              eq(profiles.userId, users.id),
              inArray(users.nim, menteeNims),
            ),
          );

        // Update allMentee with submission data
        const menteeAssignment = allMentee.map((mentee) => {
          const submission = submissions.find((s) => s.nim === mentee.nim);

          return {
            ...mentee,
            keterlambatan: calculateOverDueTime(
              submission?.deadline,
              submission?.updatedAt,
            ),
            assignmentSubmissions: submission ?? null,
            linkFile: submission?.linkFile ?? null,
            nilai: submission?.nilai ?? 0,
          };
        });

        return {
          data: menteeAssignment,
          meta: {
            totalCount: countRows.count,
            page,
            pageSize,
            totalPages: Math.ceil(countRows.count / pageSize),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${String(error)}`,
          });
        }
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error when fetched all mentee assignment on assignment",
        });
      }
    }),

  editMenteeAssignmentSubmissionPoint: mentorProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        menteeNim: z.string(),
        point: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { assignmentId, menteeNim, point } = input;

        if (point < 0 || point > 100) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Point must be between 0 and 100",
          });
        }

        // Fetch submission data to find the previous point
        const submission = await ctx.db
          .select({
            point: assignmentSubmissions.point,
          })
          .from(assignmentSubmissions)
          .where(
            and(
              eq(assignmentSubmissions.assignmentId, assignmentId),
              eq(assignmentSubmissions.userNim, menteeNim),
            ),
          );

        if (!submission || submission.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Assignment submission not found for the given mentee and assignment",
          });
        }

        const previousPoint = submission[0]?.point ?? 0;

        // Update the assignment submission's point
        await ctx.db
          .update(assignmentSubmissions)
          .set({ point })
          .where(
            and(
              eq(assignmentSubmissions.assignmentId, assignmentId),
              eq(assignmentSubmissions.userNim, menteeNim),
            ),
          );

        // Recalculate the total points for the mentee's profile
        const totalMenteePoints = await ctx.db
          .select({
            total: sum(assignmentSubmissions.point),
          })
          .from(assignmentSubmissions)
          .where(eq(assignmentSubmissions.userNim, menteeNim))
          .then((rows) => rows[0]?.total ?? 0);

        // Update the mentee's profile point in the profiles table
        const user = await ctx.db
          .select({
            userId: users.id,
          })
          .from(users)
          .where(eq(users.nim, menteeNim));

        if (!user || user.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        await ctx.db
          .update(profiles)
          .set({ point: Number(totalMenteePoints) })
          .where(eq(profiles.userId, user[0]?.userId ?? ""));

        // Recalculate the total group points for the assignment
        const groupInfo = await ctx.db
          .select({
            groupName: profiles.group,
            groupPoint: groups.point,
          })
          .from(profiles)
          .innerJoin(users, eq(profiles.userId, users.id))
          .innerJoin(groups, eq(profiles.group, groups.name))
          .where(eq(users.nim, menteeNim))
          .then((rows) => rows[0]);

        if (!groupInfo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group information not found for the mentee",
          });
        }

        const { groupName, groupPoint } = groupInfo;

        // Recalculate total group points
        const newGroupPoints = groupPoint - previousPoint + point;

        // Update the group's point in the groups table
        await ctx.db
          .update(groups)
          .set({ point: newGroupPoints })
          .where(eq(groups.name, groupName));

        return {
          success: true,
          message: "Mentee assignment point updated successfully",
          updatedGroup: {
            groupName,
            updatedGroupPoint: newGroupPoints,
          },
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error when updating mentee assignment point: ${String(error)}`,
        });
      }
    }),

  getAllAssignment: mentorMametProcedure
    .input(
      z.object({
        searchString: z.string().optional().default(""),
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { searchString, sortOrder, page, pageSize } = input;

        const offset = (page - 1) * pageSize;
        const res = await ctx.db
          .select({
            judulTugas: assignments.title,
            waktuMulai: assignments.startTime,
            waktuSelesai: assignments.deadline,
            assignmentId: assignments.id,
            downloadUrl: assignments.downloadUrl,
          })
          .from(assignments)
          .where(
            or(
              ilike(assignments.title, `%${searchString}%`),
              ilike(assignments.description, `%${searchString}%`),
            ),
          )
          .limit(pageSize)
          .offset(offset)
          .orderBy(
            sortOrder === "asc"
              ? asc(assignments.startTime)
              : desc(assignments.startTime),
          );

        const countRows = (
          await ctx.db
            .select({
              count: count(),
            })
            .from(assignments)
        )[0] ?? { count: 0 };

        return {
          data: res,
          meta: {
            totalCount: countRows.count,
            page,
            pageSize,
            totalPages: Math.ceil(countRows.count / pageSize),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${String(error)}`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occured while getting all main assignment ",
        });
      }
    }),

  getAllMainAssignment: mentorMametProcedure
    .input(
      z.object({
        searchString: z.string().optional().default(""),
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { searchString, sortOrder, page, pageSize } = input;

        const offset = (page - 1) * pageSize;

        const res = await ctx.db
          .select({
            judulTugas: assignments.title,
            waktuMulai: assignments.startTime,
            waktuSelesai: assignments.deadline,
            assignmentId: assignments.id,
            downloadUrl: assignments.downloadUrl,
          })
          .from(assignments)
          .where(
            and(
              eq(assignments.assignmentType, assignmentTypeEnum.enumValues[0]),
              or(
                ilike(assignments.title, `%${searchString}%`),
                ilike(assignments.description, `%${searchString}%`),
              ),
            ),
          )
          .limit(pageSize)
          .offset(offset)
          .orderBy(
            sortOrder === "asc"
              ? asc(assignments.startTime)
              : desc(assignments.startTime),
          );

        // Count the total number of "Main" assignments
        const countRows = (
          await ctx.db
            .select({
              count: count(),
            })
            .from(assignments)
            .where(
              eq(assignments.assignmentType, assignmentTypeEnum.enumValues[0]),
            )
        )[0] ?? { count: 0 }; // Ensure count matches "Main" assignments

        return {
          data: res,
          meta: {
            totalCount: countRows.count,
            page,
            pageSize,
            totalPages: Math.ceil(countRows.count / pageSize),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `An error occurred: ${String(error)}`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while getting all main assignments",
        });
      }
    }),

  getSpecificAssignmentCsv: mentorMametProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { assignmentId } = input;

        const results = await ctx.db
          .select({
            nim: assignmentSubmissions.userNim,
            nama: profiles.name,
            waktuPengumpulan: assignmentSubmissions.updatedAt,
            kelompok: profiles.group,
            nilai: assignmentSubmissions.point,
          })
          .from(assignmentSubmissions)
          .innerJoin(users, eq(assignmentSubmissions.userNim, users.nim))
          .innerJoin(profiles, eq(users.id, profiles.userId))
          .where(
            and(
              eq(assignmentSubmissions.assignmentId, assignmentId),
              eq(users.nim, assignmentSubmissions.userNim),
              eq(profiles.userId, users.id),
            ),
          )
          .execute();

        const headers = [
          "NIM",
          "Nama",
          "Waktu Pengumpulan",
          "Kelompok",
          "Nilai",
        ];

        const csvRows = results.map((result) => [
          result.nim,
          result.nama,
          result.waktuPengumpulan.toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          result.kelompok,
          result.nilai,
        ]);

        const csvContent = [
          headers.join(","),
          ...csvRows.map((row) => row.join(",")),
        ].join("\n");

        return {
          fileName: `rekapNilai_${assignmentId}.csv`,
          mimeType: "text/csv",
          content: csvContent,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when create a new assignment",
        });
      }
    }),

  uploadNewAssignmentMamet: mametProcedure
    .input(
      z.object({
        filename: z.string(),
        title: z.string(),
        assignmentType: z.enum(assignmentTypeEnum.enumValues),
        point: z.number(),
        startTime: z.date(),
        deadline: z.date(),
        description: z.string(),
        downloadUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          filename,
          title,
          assignmentType,
          point,
          startTime,
          deadline,
          description,
          downloadUrl,
        } = input;

        await ctx.db.insert(assignments).values({
          title,
          assignmentType,
          point,
          startTime,
          deadline,
          description,
          downloadUrl,
          filename,
          updatedAt: new Date(),
          createdAt: new Date(),
        });

        // add into notification
        const content = `Ada tugas baru nih - ${title}, jangan lupa dikerjain ya!`;

        await ctx.db.insert(notifications).values({
          content,
        });

        return {
          success: true,
          message: "New assignment added updated successfully",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while generating the CSV",
        });
      }
    }),

  editAssignmentMamet: mametProcedure
    .input(
      z.object({
        id: z.string(),
        filename: z.string(),
        title: z.string(),
        point: z.number(),
        startTime: z.date(),
        deadline: z.date(),
        description: z.string(),
        downloadUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          id,
          filename,
          title,
          point,
          startTime,
          deadline,
          description,
          downloadUrl,
        } = input;

        const data = {
          id,
          filename,
          title,
          point,
          startTime,
          deadline,
          description,
          downloadUrl,
          updatedAt: new Date(),
        };

        await ctx.db
          .update(assignments)
          .set(data)
          .where(eq(assignments.id, id));

        return {
          success: true,
          message: "The assignment is successfully updated",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when updating  an assignment",
        });
      }
    }),

  deleteAssignmentMamet: mametProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId } = input;

      try {
        await ctx.db
          .delete(assignments)
          .where(eq(assignments.id, assignmentId));

        return {
          message: "Assignment deletion attempted",
          deletedId: assignmentId,
        };
      } catch (error) {
        console.error("Error deleting assignment:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An error occurred while deleting the assignment`,
        });
      }
    }),
});
