// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { Assignment, assignments, assignmentTypeEnum } from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { uuid } from "drizzle-orm/pg-core";
import { now } from "next-auth/client/_utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";
import { FolderEnum } from "~/server/bucket";


export const assignmentRouter = createTRPCRouter({
    uploadNewAssignmentMamet:publicProcedure
      .input(z.object({
        file: z.string().optional(),
        judul:z.string(),
        assignmentType: z.enum(assignmentTypeEnum.enumValues),
        point:z.number().optional(),
        waktuMulai:z.date().optional(),
        waktuSelesai:z.date(),
        deskripsi:z.string(),
      }))
      .mutation(async({ctx,input})=>{
          try{
            const { file,judul,assignmentType, point,waktuMulai,waktuSelesai,deskripsi} = input;
            
            const id = uuidv4();

            const inst:Assignment = {
                id,
                point:point ? point : null,
                file:file ? file : null,
                title:judul,
                description:deskripsi,
                startTime:waktuMulai ? waktuMulai : null,
                deadline:waktuSelesai,
                assignmentType,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const res = await ctx.db.insert(assignments).values(
              inst
            ).returning({id: assignments.id});

            return res[0];
          }catch(error){
              console.log(error)
              throw new TRPCError({
                  code:"INTERNAL_SERVER_ERROR",
                  message:"Error when create a new assignment"
              })
          }
      }),
});
