// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { assignments, assignmentTypeEnum } from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {eq}  from "drizzle-orm";
import { AssignmentType } from "@katitb2024/database";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";

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
    })
});
