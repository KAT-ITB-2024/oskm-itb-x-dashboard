// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { assignments, assignmentSubmissions, profiles, users } from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {eq, and} from "drizzle-orm";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";

export const assignmentRouter = createTRPCRouter({

  getMenteeAssignmentSubmission:publicProcedure
    .input(z.object({
        assignmentId:z.string(),
        groupName:z.string()
    }))
    .query(async({ctx,input})=>{
        try{
          // with the assumption that we fetch the groupName using input instead of context/session
            const {assignmentId, groupName} = input;

            const res = await ctx.db
            .select({
              nama: profiles.name,
              nim: users.nim,
              nilai: assignmentSubmissions.point,
              linkFile: assignmentSubmissions.file,
              updatedAt: assignmentSubmissions.updatedAt,
              deadline: assignments.deadline,
            })
            .from(assignmentSubmissions)
            .innerJoin(users, eq(assignmentSubmissions.userNim, users.nim))
            .innerJoin(profiles, eq(users.id, profiles.userId))
            .innerJoin(assignments, eq(assignmentSubmissions.assignmentId, assignments.id))
            .where(
              and(
                eq(assignmentSubmissions.assignmentId, assignmentId),
                eq(users.nim, assignmentSubmissions.userNim),
                eq(profiles.userId, users.id),
                eq(profiles.group, groupName)
              )
            );
            
            const resultsWithKeterlambatan = res.map(item => ({
              ...item,
              keterlambatan: item.updatedAt > item.deadline
                ?  Math.floor((item.updatedAt.getTime() - item.deadline.getTime()) / 1000) : 0
            }));

            return resultsWithKeterlambatan;
        }catch(error){
          console.log(error)
          throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:"error when fetched all mentee assignment on assignment : ${}"
          })
        }
    })

});
