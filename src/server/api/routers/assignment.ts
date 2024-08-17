// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)

import { assignments, AssignmentType, assignmentTypeEnum, assignmentSubmissions, profiles, users } from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {eq , and}  from "drizzle-orm";
import {  } from "@katitb2024/database";



import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  // mametMentorProcedure,
} from "~/server/api/trpc";
import { profile } from "console";

export const assignmentRouter = createTRPCRouter({
  getAllMainAssignmentMentor:publicProcedure
    .query(async({ctx})=>{
        try{  
          
          const compare:AssignmentType = 'Main';
          const res = await ctx.db
                .select({
                  judulTugas:assignments.title,
                  waktuMulai:assignments.startTime,
                  waktuSelesai:assignments.deadline
                })
                .from(assignments)
                .where(eq(assignments.assignmentType,compare ))

          return res
        }catch(error){
          throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occured while getting all main assignment "
          })
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
          message: "An error occurred while generating the CSV",
        });
      }
    }),
});
