// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { assignments, assignmentSubmissions, groups, profiles, users } from "@katitb2024/database";
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

type MenteeAssignment = {
    nama:string
    nim:string
    keterlambatan:number|null;
    nilai: number | null;
    linkFile:string|null;
    assignmentSubmissions:string|null;

}

export const assignmentRouter = createTRPCRouter({

  getMenteeAssignmentSubmission:publicProcedure
    .input(z.object({
        assignmentId:z.string(),
        groupName:z.string()
    }))
    .query(async({ctx,input})=>{
        try{
            const {assignmentId, groupName} = input;

            const res = await ctx.db
            .select({
              nama: profiles.name,
              nim: users.nim,
              nilai: assignmentSubmissions.point,
              linkFile: assignmentSubmissions.file,
              updatedAt: assignmentSubmissions.updatedAt,
              deadline: assignments.deadline,
              assignmentsId:assignmentSubmissions.id,
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
              terlambat: item.updatedAt > item.deadline  ?  Math.floor((item.updatedAt.getTime() - item.deadline.getTime()) / 1000) : 0
            }));

            const allMentee = await ctx.db.select({
                                                              nama:profiles.name,
                                                              nim:users.nim
                                                          })
                                                        .from(profiles)
                                                        .where(eq(profiles.group,groupName))
                                                        .innerJoin(users,eq(users.id,profiles.userId))


            const menteeAssignment = allMentee  as MenteeAssignment[];

            menteeAssignment.forEach(mentee=>{
              const find = resultsWithKeterlambatan.find(r => r.nama === mentee.nama && r.nim === r.nim)

              mentee.keterlambatan = find ? find.terlambat : null;
              mentee.nilai = find ? find.nilai : null;
              mentee.linkFile = find ? find.linkFile : null
              mentee.assignmentSubmissions = find ? find.assignmentsId : null;
            })

            return menteeAssignment;
        }catch(error){
          console.log(error)
          throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:"error when fetched all mentee assignment on assignment : ${}"
          })
        }
    }),
  editMenteeAssignmentPoint:publicProcedure
    .input(z.object({
        assignmentId:z.string(),
        point:z.number(),
    }))
    .mutation(async({ctx,input})=>{
      try{
            const {assignmentId, point} = input;

          let [group] = await ctx.db.select({
                                              groupName:groups.name,
                                              point:groups.point
                                            })
                                            .from(assignmentSubmissions)
                                            .where(eq(assignmentSubmissions.id,assignmentId))
                                            .innerJoin(users,eq(users.nim,assignmentSubmissions.userNim))
                                            .innerJoin(profiles,eq(profiles.userId, users.id))
                                            .innerJoin(groups,eq(groups.name, profiles.group))

        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group data not found for the given assignment",
          });
        }

          let [prevData] = await ctx.db.select({
                                                          point:assignmentSubmissions.point
                                                        })
                                                        .from(assignmentSubmissions)
                                                        .where(eq(assignmentSubmissions.id,assignmentId))
          
          if(group?.point !== undefined && prevData?.point !== null){
              group.point -= prevData!.point
          }

        if(!prevData){
          throw new TRPCError({
            code:"NOT_FOUND",
            message:"Assignment submission not found",
          })
        }

          prevData!.point = point;
          group!.point = group!.point + point;
        
          await ctx.db.update(assignmentSubmissions)
                        .set({point:prevData!.point})
                        .where(eq(assignmentSubmissions.id,assignmentId));

          // update group data
          const res = await ctx.db.update(groups)
                .set({point:group!.point})
                .where(eq(groups.name,group.groupName));

            return {
                success: true,
                message: "Mentee assignment point updated successfully",
                updatedGroup: group
              };
        }catch(error){
          console.log(error)
          throw new TRPCError({
            code:"INTERNAL_SERVER_ERROR",
            message:`Error when updating mentee assignment point : ${error}`
          })
        }
    })
  

});
