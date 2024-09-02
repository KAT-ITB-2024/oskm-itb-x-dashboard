// Router ini digunakan untuk segala yang berkaitan dengan presence (absensi)
import {
  type EventDay,
  type PresenceEvent,
  type PresenceType,
  eventPresences,
  events,
  presenceEventEnum,
  presenceTypeEnum,
  profiles,
  roleEnum,
  users,
} from "@katitb2024/database";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  mentorProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export type TAttendanceOfAnEvent = {
  nim: string;
  name: string;
  group: string;
  presence: PresenceType;
}[];

export type TAttendance = {
  day: EventDay;
  openingOrClosing: PresenceEvent;
  attendance: TAttendanceOfAnEvent;
};

export type TPresenceBaseResponse<T> = {
  ok: boolean;
  message?: string;
  data: T | null;
};

export const presenceRouter = createTRPCRouter({
  // Mentor
  getPresenceOfAGroupInAnEvent: mentorProcedure
    .input(
      z.object({
        eventId: z.string(),
        groupName: z.string(),
        presenceEvent: z.enum([...presenceEventEnum.enumValues]),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { groupName, eventId, presenceEvent, page, limit, search } = input;

      const groupExists = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.group, groupName))
        .limit(1);

      if (!groupExists.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kelompok/group not found",
        });
      }

      const eventExists = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, eventId))
        .limit(1);

      if (!eventExists.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // Fetch users in the specified group with the role "Peserta"
      const usersQuery = ctx.db
        .select({
          nim: users.nim,
          name: profiles.name,
          userId: users.id,
        })
        .from(users)
        .innerJoin(profiles, eq(users.id, profiles.userId))
        .where(
          and(
            eq(profiles.group, groupName),
            eq(users.role, roleEnum.enumValues[0]),
            ilike(profiles.name, `%${search ? search : ""}%`),
          ),
        );

      const usersInGroup = await usersQuery;

      if (!usersInGroup.length) {
        return [];
      }

      const nimValues = usersInGroup.map((user) => user.nim);

      // Fetch matching presences for the event
      const matchingPresences = await ctx.db
        .select({
          id: eventPresences.id,
          createdAt: eventPresences.createdAt,
          updatedAt: eventPresences.updatedAt,
          presenceType: eventPresences.presenceType,
          presenceEvent: eventPresences.presenceEvent,
          userNim: eventPresences.userNim,
          eventId: eventPresences.eventId,
        })
        .from(eventPresences)
        .where(
          and(
            eq(eventPresences.eventId, eventId),
            eq(eventPresences.presenceEvent, presenceEvent),
            inArray(eventPresences.userNim, nimValues),
          ),
        );

      // Mapping presence data with user names
      const matchingPresencesWithName = matchingPresences.map((presence) => {
        const user = usersInGroup.find((user) => user.nim === presence.userNim);
        return {
          ...presence,
          name: user?.name,
        };
      });

      // Creating Alpha presences for users not found in eventPresences
      const alphaPresences = usersInGroup.map((user) => ({
        id: crypto.randomUUID(), // Generating a random unique ID
        createdAt: new Date(),
        updatedAt: new Date(),
        presenceType: presenceTypeEnum.enumValues[2],
        presenceEvent: presenceEvent,
        userNim: user.nim,
        name: user.name,
        eventId: eventId,
      }));

      // Merging the presence data with Alpha data if no presence is found
      const presences = usersInGroup.map((user) => {
        const presence = matchingPresencesWithName.find(
          (p) => p.userNim === user.nim,
        );

        if (presence) {
          return presence;
        } else {
          return alphaPresences.find((p) => p.userNim === user.nim)!;
        }
      });

      // Implement pagination
      const offset = (page - 1) * limit;
      const paginatedPresences = presences.slice(offset, offset + limit);

      return {
        ok: true,
        data: paginatedPresences,
        message: "Successfully fetched group presence data.",
        meta: {
          page,
          limit,
          total: presences.length,
        },
      };
    }),

  // Mentor
  // Status: Tested
  upsertGroupPresenceData: mentorProcedure
    .input(
      z.object({
        eventId: z.string(),
        presenceEvent: z.enum([...presenceEventEnum.enumValues]),
        presences: z.array(
          z.object({
            userNim: z.string(),
            presenceType: z.enum([...presenceTypeEnum.enumValues]),
            keterangan: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { eventId, presenceEvent, presences } = input;

      // Check if the event exists
      const eventExists = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, eventId));

      if (eventExists.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // Prepare the values to be inserted or updated
      const valuesToInsert = presences.map((presence) => ({
        eventId,
        userNim: presence.userNim,
        presenceType: presence.presenceType,
        presenceEvent,
        remarks: presence.keterangan ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await ctx.db.transaction(async (tx) => {
        for (const value of valuesToInsert) {
          await tx
            .insert(eventPresences)
            .values(value)
            .onConflictDoUpdate({
              target: [
                eventPresences.eventId,
                eventPresences.presenceEvent,
                eventPresences.userNim,
              ],
              set: {
                presenceType: value.presenceType,
                remarks: value.remarks,
                updatedAt: new Date(),
              },
            });
        }
      });

      return {
        message: "Presences successfully inserted/updated",
      };
    }),
});
