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
import { Readable } from "stream";

export const assignmentRouter = createTRPCRouter({
  getMainQuestAssignment: publicProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try{
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

        const buffer = Buffer.from(csvContent, 'utf-8');
        const stream = Readable.from(buffer);
        return {
          fileName: `rekapNilai_${assignmentId}.csv`,
          mimeType: 'text/csv',
          stream,
        };
      }catch(error){
        if (error instanceof Error) {
          throw new TRPCError({
            message: error.message,
            code: "BAD_REQUEST",
          });
        } else {
          throw new TRPCError({
            message: "An unknown error occurred",
            code: "BAD_REQUEST",
          });
        }
      }
    }),
});
