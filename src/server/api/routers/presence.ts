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
import { and, asc, eq, ilike, inArray } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  mentorProcedure,
  //   mentorMametProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
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
      page: z.number().min(1).default(1), // Pagination: page number
      limit: z.number().min(1).max(100).default(10), // Pagination: limit per page
      search: z.string().optional(), // Search query for user's name
    })
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
      .where(and(
        eq(profiles.group, groupName),
        eq(users.role, roleEnum.enumValues[0]),
        ilike(profiles.name, `%${search ? search : ""}%`)
      ));

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
          inArray(eventPresences.userNim, nimValues) // use the inArray method instead of raw SQL
        )
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
      presenceType: presenceTypeEnum.enumValues[2], // Alpha
      presenceEvent: presenceEvent,
      userNim: user.nim,
      name: user.name, // Using the user's name from profile
      eventId: eventId,
    }));

    // Merging the presence data with Alpha data if no presence is found
    const presences = usersInGroup.map((user) => {
      const presence = matchingPresencesWithName.find(
        (p) => p.userNim === user.nim
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
  editPresence: mentorProcedure
    .input(
      z.object({
        eventId: z.string(),
        nim: z.string(),
        presence: z.enum(["Hadir", "Izin/Sakit", "Alpha"]),
        openingOrClosing: z.enum(["Opening", "Closing"]),
      }),
    )
    .mutation(
      async ({ input: { eventId, nim, presence, openingOrClosing } }) => {
        try {
          await db
            .update(eventPresences)
            .set({
              presenceType: presence,
            })
            .where(
              and(
                eq(eventPresences.eventId, eventId),
                eq(eventPresences.userNim, nim),
                eq(eventPresences.presenceEvent, openingOrClosing),
              ),
            );
          return {
            ok: true,
            message: "Success edit presence",
            data: {
              eventId,
              nim,
              presence,
              openingOrClosing,
            },
          };
        } catch (error) {
          return {
            ok: false,
            message: "Internal server error",
            data: null,
          };
        }
      },
    ),

  // Mamet
  // Status: Tested
  /**
   * Delete the presence of an event
   * @param eventId The ID of the event
   * @param openingOrClosing The opening or closing event
   */
  deletePresence: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        openingOrClosing: z.enum(["Opening", "Closing"]),
      }),
    )
    .mutation<TPresenceBaseResponse<null>>(
      async ({ input: { eventId, openingOrClosing } }) => {
        try {
          await db
            .delete(eventPresences)
            .where(
              and(
                eq(eventPresences.eventId, eventId),
                eq(eventPresences.presenceEvent, openingOrClosing),
              ),
            );

          return {
            ok: true,
            message: "Success delete presence",
            data: null,
          };
        } catch (error) {
          return {
            ok: false,
            message: "Internal server error",
            data: null,
          };
        }
      },
    ),

  // Mamet
  // Status: Tested
  /**
   * Get the presence of an event
   * @param eventId The ID of the event
   * @param openingOrClosing The opening or closing event
   * @param page The page number (1-indexed)
   * @param dataPerPage The number of data per page
   */
  getPresenceOfAnEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        openingOrClosing: z.enum(["Opening", "Closing"]),
        page: z.number(),
        dataPerPage: z.number(),
      }),
    )
    .query<TPresenceBaseResponse<TAttendanceOfAnEvent>>(
      async ({ input: { eventId, openingOrClosing, page, dataPerPage } }) => {
        try {
          const returned = await db
            .select({
              nim: users.nim,
              name: profiles.name,
              group: profiles.group,
              presence: eventPresences.presenceType,
            })
            .from(events)
            .innerJoin(eventPresences, eq(events.id, eventPresences.eventId))
            .innerJoin(users, eq(users.nim, eventPresences.userNim))
            .innerJoin(profiles, eq(profiles.userId, users.id))
            .where(
              and(
                eq(events.id, eventId),
                eq(eventPresences.presenceEvent, openingOrClosing),
              ),
            );

          const paginatedData = returned.slice(
            dataPerPage * (page - 1),
            dataPerPage * page,
          );
          const data = paginatedData.map((row) => ({
            nim: row.nim,
            name: row.name,
            group: row.group,
            presence: row.presence,
          }));

          return {
            ok: true,
            message: "Success get presence",
            data,
          };
        } catch (error) {
          return {
            ok: false,
            message: "Internal server error",
            data: null,
          };
        }
      },
    ),

  // Mamet
  // Status: Tested
  getPresenceOfAnEventCSV: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        openingOrClosing: z.enum(["Opening", "Closing"]),
      }),
    )
    .query<
      TPresenceBaseResponse<{
        filename: string;
        mimeType: string;
        content: string;
      }>
    >(async ({ input: { eventId, openingOrClosing } }) => {
      try {
        const returned = await db
          .select({
            nim: users.nim,
            name: profiles.name,
            group: profiles.group,
            presence: eventPresences.presenceType,
          })
          .from(events)
          .innerJoin(eventPresences, eq(events.id, eventPresences.eventId))
          .innerJoin(users, eq(users.nim, eventPresences.userNim))
          .innerJoin(profiles, eq(profiles.userId, users.id))
          .where(
            and(
              eq(events.id, eventId),
              eq(eventPresences.presenceEvent, openingOrClosing),
            ),
          );

        const data = returned
          .map((row) => `${row.nim},${row.name},${row.group},${row.presence}`)
          .join("\n");

        const headers = ["NIM", "Nama", "Kelompok", "Kehadiran"];
        const csvContent = [headers.join(","), data].join("\n");

        return {
          ok: true,
          message: "Success get presence",
          data: {
            filename: `presence_${eventId}_${openingOrClosing}_.csv`,
            mimeType: "text/csv",
            content: csvContent,
          },
        };
      } catch (error) {
        return {
          ok: false,
          message: "Internal server error",
          data: null,
        };
      }
    }),

  // mendapat list presensi peserta pada sesuai keluarga dan event
  getPresensiPeserta: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        group: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const presensiPeserta = await ctx.db
        .select({
          nim: users.nim,
          nama: profiles.name,
          status: eventPresences.presenceType,
          updatedAt: eventPresences.updatedAt,
        })
        .from(eventPresences)
        .leftJoin(events, eq(events.id, eventPresences.eventId))
        .leftJoin(users, eq(users.nim, eventPresences.userNim))
        .leftJoin(profiles, eq(profiles.userId, users.id))
        .where(
          and(
            eq(profiles.group, input.group),
            eq(users.role, roleEnum.enumValues[0]),
            eq(eventPresences.eventId, input.eventId),
          ),
        );

      return presensiPeserta;
    }),

  updatePresensiPeserta: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        userNim: z.string(),
        newPresenceType: z.enum(["Hadir", "Izin/Sakit", "Alpha"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Expected output: update status presensi peserta pada suatu kelompok

      // check if event exist
      const event = await ctx.db
        .select()
        .from(events)
        .where(eq(events.id, input.eventId));

      if (event.length == 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        });
      }

      // check if event exist
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.nim, input.userNim));

      if (user.length == 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db
        .update(eventPresences)
        .set({
          presenceType: input.newPresenceType,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(eventPresences.userNim, input.userNim),
            eq(eventPresences.eventId, input.eventId),
          ),
        );

      return { message: "Presence successfully updated" };
    }),
  getEventsThatHasPresence: publicProcedure
    .input(
      z.object({
        page: z.number(),
        dataPerPage: z.number(),
      }),
    )
    .query(async ({ input: { page, dataPerPage } }) => {
      const eventsWithPresence = await db
        .selectDistinct({
          eventId: events.id,
          eventDay: events.day,
          eventDate: events.eventDate,
          openingOpenPresenceTime: events.openingOpenPresenceTime,
          openingClosePresenceTime: events.openingClosePresenceTime,
          closingOpenPresenceTime: events.closingOpenPresenceTime,
          closingClosePresenceTime: events.closingClosePresenceTime,
        })
        .from(events)
        .leftJoin(eventPresences, eq(events.id, eventPresences.eventId))
        .orderBy(asc(events.eventDate));

      // Calculate total number of items (before slicing)
      const totalItems = eventsWithPresence.length;

      // Apply pagination
      const paginatedData = eventsWithPresence.slice(
        dataPerPage * (page - 1),
        dataPerPage * page,
      );

      // Return both paginated data and total item count
      return {
        paginatedData,
        totalItems,
      };
    }),
});
