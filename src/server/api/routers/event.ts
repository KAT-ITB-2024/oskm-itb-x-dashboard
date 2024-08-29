// Router ini digunakan untuk segala yang berkaitan dengan event
import { z } from "zod";

import {
  createTRPCRouter,
  mametProcedure,
  mentorMametProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { eq } from "drizzle-orm";

import { events, eventDayEnum } from "@katitb2024/database";
import { z_date, z_time } from "~/utils/dateUtils";

export const eventRouter = createTRPCRouter({
  getEvents: mentorMametProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(events);
  }),

  getEvent: mentorMametProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select({
          id: events.id,
          day: events.day,
          eventDate: events.eventDate,
          openingOpenPresenceTime: events.openingOpenPresenceTime,
          closingOpenPresenceTime: events.closingOpenPresenceTime,
          openingClosePresenceTime: events.openingClosePresenceTime,
          closingClosePresenceTime: events.closingClosePresenceTime,
          createdAt: events.createdAt,
          updatedAt: events.updatedAt,
        })
        .from(events)
        .where(eq(events.id, input.id));

      if (!res.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      return res[0];
    }),

  updateEvent: mametProcedure
    .input(
      z.object({
        id: z.string(),
        day: z.enum(eventDayEnum.enumValues).optional(),
        eventDate: z_date.optional(),
        openingOpenPresenceTime: z_time.optional(),
        closingOpenPresenceTime: z_time.optional(),
        openingClosePresenceTime: z_time.optional(),
        closingClosePresenceTime: z_time.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.id));

      if (!event.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      await ctx.db
        .update(events)
        .set({
          day: input.day,
          eventDate: new Date(input.eventDate ?? ""),
          openingOpenPresenceTime: input.openingOpenPresenceTime,
          closingOpenPresenceTime: input.closingOpenPresenceTime,
          openingClosePresenceTime: input.openingClosePresenceTime,
          closingClosePresenceTime: input.closingClosePresenceTime,
          updatedAt: new Date(),
        })
        .where(eq(events.id, input.id))
        .returning({ updatedId: events.id });

      return { message: "Event successfully updated" };
    }),
});
