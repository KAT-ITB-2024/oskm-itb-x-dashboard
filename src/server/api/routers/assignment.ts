// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { assignments } from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";
import { assign } from "nodemailer/lib/shared";

export const assignmentRouter = createTRPCRouter({
    editAssignmentMamet:publicProcedure
      .input(z.object({
          assignmentId:z.string(),
          file: z.string().optional(),
          judul:z.string().optional(),
          point:z.number().optional(),
          waktuMulai:z.date().optional(),
          waktuSelesai:z.date().optional(),
          deskripsi:z.string().optional(),
      }))
      .mutation(async({ctx,input})=>{
          try{

            const { assignmentId, ...updateData } = input;

            const filteredUpdateData = Object.fromEntries(
              Object.entries(updateData).filter(([_, value]) => value != null)
            );



            const updateAssignment = await ctx.db.update(assignments)
                                                                      .set(filteredUpdateData)
                                                                      .where(eq(assignments.id,assignmentId))
              

            return {
                success:true,
                message:"The assignment is successfully updated",
            }


          }catch(error){
            console.log(error)
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:"Error when updating  an assignment"
            })
          }
      })
});
