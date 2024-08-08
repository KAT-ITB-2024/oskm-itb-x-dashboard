// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import {
  Assignment,
  AssignmentSubmission,
  assignmentSubmissions,
  profiles,
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  // mametMentorProcedure,
} from "~/server/api/trpc";
import { resultOf } from "node_modules/@trpc/client/dist/links/internals/urlWithConnectionParams";

export const assignmentRouter = createTRPCRouter({
  getMainQuestAssignment: publicProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId } = input;

      const res = await ctx.db
        .select({
          nim: profiles.userId,
          nama: profiles.name,
          waktuPengumpulan: assignmentSubmissions.updatedAt,
          kelompok: profiles.group,
          nilai: assignmentSubmissions.point,
        })
        .from(assignmentSubmissions)
        .leftJoin(profiles, eq(assignmentSubmissions.userNim, profiles.userId))
        .where(eq(assignmentSubmissions.assignmentId, assignmentId))
        .execute();

      if (!res) {
        throw new TRPCError({
          message: "The assignment table is empty",
          code: "BAD_REQUEST",
        });
      }
      const headers = ["NIM", "Nama", "Waktu Pengumpulan", "Kelompok", "Nilai"];
      const csvRows = res.map((result) => [
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
          dateStyle: "short",
          timeStyle: "medium",
        }),
        result.kelompok,
        result.nilai,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      return csvContent;
      // assuming all the creation process happened in frontend
      // i think if converting process to happen in the backend, there's something that need to be added into the frontend
    }),
});
