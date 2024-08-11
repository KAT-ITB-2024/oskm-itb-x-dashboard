import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, inArray, or } from "drizzle-orm/expressions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users, profiles, assignmentSubmissions, eventPresences, assignments } from "~/server/db/schema";
import { count } from "drizzle-orm/sql/functions";

export const groupDetailsRouters = createTRPCRouter({
    getProfileDetails: publicProcedure
      .input(z.object({ groupNumber: z.number() }))
      .query(async ({ ctx, input }) => {

        const resultName = await ctx.db
        .select({name: profiles.name})
        .from(profiles)
        .where(eq(profiles.groupNumber, input.groupNumber))
  
        const resultNim = await ctx.db
        .select({nim: users.nim})
        .from(users)
        .where(eq(profiles.groupNumber, input.groupNumber))
        
        const resultFaculty = await ctx.db
        .select({faculty: profiles.faculty})
        .from(profiles)
        .where(eq(profiles.groupNumber, input.groupNumber))      

        const countAssignments = await ctx.db
        .select({count: count()})
        .from(assignments)

        const countAssignmentsSubmitted = await ctx.db
        .select({count: count(assignmentSubmissions.)})
        .from(assignmentSubmissions)
        .where(eq())
        // TODO: isi logic disini
        // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
    })
})