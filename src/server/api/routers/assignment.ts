// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)

import {
  assignments,
  notifications,
  type AssignmentType,
  assignmentTypeEnum,
  assignmentSubmissions,
  groups,
  profiles,
  users,
  Assignment,
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, and, inArray, asc, or, ilike, count, desc } from "drizzle-orm";
import { calculateOverDueTime } from "~/utils/dateUtils";
import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  // mametMentorProcedure,
} from "~/server/api/trpc";
import { title } from "process";

type MenteeAssignment = {
  nama: string;
  nim: string;
  keterlambatan: number | null;
  nilai: number;
  linkFile: string | null;
  assignmentSubmissions: string | null;
};

export const assignmentRouter = createTRPCRouter({
  getAssignmentDetail: publicProcedure
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
            judulTugas: assignments.title,
            waktuMulai: assignments.startTime,
            waktuSelesai: assignments.deadline,
            deskripsi: assignments.description,
            assignmentType: assignments.assignmentType,
            point: assignments.point,
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

  getMenteeAssignmentSubmission: publicProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        groupName: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
        searchString: z.string().optional().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { assignmentId, groupName, page, pageSize, searchString } = input;

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
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "THERE IS NO MENTEE",
          });
        }

        const menteeNims = allMentee.map((mentee) => mentee.nim);

        const menteeAssignment = allMentee as MenteeAssignment[];
        const submissions = await ctx.db
          .select({
            nama: profiles.name,
            nim: users.nim,
            nilai: assignmentSubmissions.point,
            linkFile: assignmentSubmissions.downloadUrl,
            updatedAt: assignmentSubmissions.updatedAt,
            deadline: assignments.deadline,
            assignmentsId: assignmentSubmissions.id,
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

        menteeAssignment.forEach((mentee) => {
          const find = submissions.find((s) => s.nim == mentee.nim);
          mentee.keterlambatan = calculateOverDueTime(
            find?.deadline,
            find?.updatedAt,
          );
          mentee.assignmentSubmissions = find?.assignmentsId ?? null;
          mentee.linkFile = find?.linkFile ?? null;
          mentee.nilai = find?.nilai ?? 0;
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

  editMenteeAssignmentPoint: publicProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        point: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { assignmentId, point } = input;

        const [group] = await ctx.db
          .select({
            groupName: groups.name,
            point: groups.point,
          })
          .from(assignmentSubmissions)
          .where(eq(assignmentSubmissions.id, assignmentId))
          .innerJoin(users, eq(users.nim, assignmentSubmissions.userNim))
          .innerJoin(profiles, eq(profiles.userId, users.id))
          .innerJoin(groups, eq(groups.name, profiles.group));

        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group data not found for the given assignment",
          });
        }

        const [prevData] = await ctx.db
          .select({
            point: assignmentSubmissions.point,
          })
          .from(assignmentSubmissions)
          .where(eq(assignmentSubmissions.id, assignmentId));

        if (group?.point !== undefined && prevData?.point !== null) {
          group.point -= prevData!.point;
        }

        if (!prevData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment submission not found",
          });
        }

        prevData.point = point;
        group.point = group.point + point;

        await ctx.db
          .update(assignmentSubmissions)
          .set({ point: prevData.point })
          .where(eq(assignmentSubmissions.id, assignmentId));

        // update group data
        await ctx.db
          .update(groups)
          .set({ point: group.point })
          .where(eq(groups.name, group.groupName));

        return {
          success: true,
          message: "Mentee assignment point updated successfully",
          updatedGroup: group,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error when updating mentee assignment point : ${String(error)}`,
        });
      }
    }),

  getAllMainAssignmentMentor: publicProcedure
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

        const compare: AssignmentType = "Main";
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
              eq(assignments.assignmentType, compare),
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

        if (res.length == 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "THERE IS NO SUCH ASSIGNMENT",
          });
        }

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

  getMainQuestAssignmentCsv: publicProcedure
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

  uploadNewAssignmentMamet: publicProcedure
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

  editAssignmentMamet: publicProcedure
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

  deleteAssignmentMamet: publicProcedure
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
