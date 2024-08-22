// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import {
  Assignment,
  assignments,
  assignmentTypeEnum,
  notifications,
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({
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
          message: "Error when create a new assignment",
        });
      }
    }),
});
