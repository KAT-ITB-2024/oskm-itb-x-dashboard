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

function updateAttribute(left:any, right:any){
    if(left){
      return left;
    } return right;
}

export const assignmentRouter = createTRPCRouter({
    editAssignmentMamet:publicProcedure
      .input(z.object({
          assignmentId:z.string(),
          file: z.string().optional(),
          title:z.string().optional(),
          point:z.number().optional(),
          startTime:z.date().optional(),
          deadline:z.date().optional(),
          description:z.string().optional(),
      }))
      .mutation(async({ctx,input})=>{
          try{

            const { assignmentId, ...updateData } = input;

            const [data] = await ctx.db.select()
                                              .from(assignments)
                                              .where(eq(assignments.id,assignmentId))

            if(!data){
              throw new TRPCError({
                code:"NOT_FOUND",
                message:"There is no assignment with such id"
              })
            }
            
            // manually update each
            data.deadline =updateAttribute(updateData.deadline,data.deadline);
            data.description = updateAttribute(updateData.description,data.description)
            data.file = updateAttribute(updateData.file , data.file);
            data.point = updateAttribute(updateData.point,data.point);
            data.startTime = updateAttribute(updateData.startTime, data.startTime);
            data.title = updateAttribute(updateData.title,data.title);
            data.updatedAt = new Date();
      
            await ctx.db.update(assignments)
                      .set(data)
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
