// Router ini digunakan untuk segala yang berkaitan dengan presence (absensi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm/expressions";

import {
  eventPresences,
  events,
  presenceTypeEnum,
  users
} from "@katitb2024/database";



import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";


export const presenceRouter = createTRPCRouter({

  updatePresensiPeserta: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        userNim: z.string(),
        newPresenceType: z.enum(['Hadir', 'Izin/Sakit', 'Alpha']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Expected output: update status presensi peserta pada suatu kelompok

      // check if event exist
      const event = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id,input.eventId,));

      if (event.length == 0){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // check if event exist
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.nim,input.userNim));

      if (user.length == 0){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db
        .update(eventPresences)
        .set({
          presenceType: input.newPresenceType,
        })
        .where(
          and(
            eq(eventPresences.userNim,input.userNim),
            eq(eventPresences.eventId,input.eventId)
          )
        )

        return { message: "Presence successfully updated" };

     

    }),


});


