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
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  // mametMentorProcedure,
} from "~/server/api/trpc";

type MenteeAssignment = {
  nama: string;
  nim: string;
  keterlambatan: number | null;
  nilai: number | null;
  linkFile: string | null;
  assignmentSubmissions: string | null;
};

export const assignmentRouter = createTRPCRouter({
  getMenteeAssignmentSubmission: publicProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        groupName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { assignmentId, groupName } = input;

        const res = await ctx.db
          .select({
            nama: profiles.name,
            nim: users.nim,
            nilai: assignmentSubmissions.point,
            linkFile: assignmentSubmissions.file,
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
              eq(profiles.group, groupName),
            ),
          );

        const resultsWithKeterlambatan = res.map((item) => ({
          ...item,
          terlambat:
            item.updatedAt > item.deadline
              ? Math.floor(
                  (item.updatedAt.getTime() - item.deadline.getTime()) / 1000,
                )
              : 0,
        }));

        const allMentee = await ctx.db
          .select({
            nama: profiles.name,
            nim: users.nim,
          })
          .from(profiles)
          .where(eq(profiles.group, groupName))
          .innerJoin(users, eq(users.id, profiles.userId));

        const menteeAssignment = allMentee as MenteeAssignment[];

        menteeAssignment.forEach((mentee) => {
          const find = resultsWithKeterlambatan.find(
            (r) => r.nama === mentee.nama && r.nim === r.nim,
          );

          mentee.keterlambatan = find ? find.terlambat : null;
          mentee.nilai = find ? find.nilai : null;
          mentee.linkFile = find ? find.linkFile : null;
          mentee.assignmentSubmissions = find ? find.assignmentsId : null;
        });

        return menteeAssignment;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "error when fetched all mentee assignment on assignment : ${}",
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

  getAllMainAssignmentMentor: publicProcedure.query(async ({ ctx }) => {
    try {
      const compare: AssignmentType = "Main";
      const res = await ctx.db
        .select({
          judulTugas: assignments.title,
          waktuMulai: assignments.startTime,
          waktuSelesai: assignments.deadline,
        })
        .from(assignments)
        .where(eq(assignments.assignmentType, compare));

      return res;
    } catch (error) {
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
        file: z.string().optional(),
        judul: z.string(),
        assignmentType: z.enum(assignmentTypeEnum.enumValues),
        point: z.number().optional(),
        waktuMulai: z.date().optional(),
        waktuSelesai: z.date(),
        deskripsi: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          file,
          judul,
          assignmentType,
          point,
          waktuMulai,
          waktuSelesai,
          deskripsi,
        } = input;

        const inst = {
          point: point ? point : null,
          file: file ? file : null,
          title: judul,
          description: deskripsi,
          startTime: waktuMulai ? waktuMulai : null,
          deadline: waktuSelesai,
          assignmentType,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await ctx.db.insert(assignments).values(inst).returning();

        // add into notification
        const content = `Ada tugas baru nih - ${judul}, jangan lupa dikerjain ya!`;

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
        assignmentId: z.string(),
        file: z.string().optional(),
        title: z.string().optional(),
        point: z.number().optional(),
        startTime: z.date().optional(),
        deadline: z.date().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { assignmentId, ...updateData } = input;

        const [data] = await ctx.db
          .select()
          .from(assignments)
          .where(eq(assignments.id, assignmentId));

        if (!data) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "There is no assignment with such id",
          });
        }

        // manually update each
        data.deadline = updateData.deadline ?? data.deadline;
        data.description = updateData.description ?? data.description;
        data.file = updateData.file ?? data.file;
        data.point = updateData.point ?? data.point;
        data.startTime = updateData.startTime ?? data.startTime;
        data.title = updateData.title ?? data.title;
        data.updatedAt = new Date();

        await ctx.db
          .update(assignments)
          .set(data)
          .where(eq(assignments.id, assignmentId));

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
});