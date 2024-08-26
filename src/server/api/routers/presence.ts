// Router ini digunakan untuk segala yang berkaitan dengan presence (absensi)
import {
  type EventDay,
  type PresenceEvent,
  type PresenceType,
  eventPresences,
  events,
  groups,
  profiles,
  users,
} from "@katitb2024/database";
import { profile } from "console";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
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
  // Mentor (and perhaps Mamet?)
  /**
   * Get the presence of an event
   *
   * -- query --
   * @param eventId The ID of the event
   * @param groupName The name of the group
   * @param page The page number (1-indexed)
   * @param dataPerPage The number of data per page
   * @returns TAttendanceOfAnEvent
   */
  getPresenceOfAGroupInAnEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        groupName: z.string().optional(),
        page: z.number(),
        dataPerPage: z.number(),
      }),
    )
    .query<TPresenceBaseResponse<TAttendanceOfAnEvent>>(
      async ({ input: { eventId, groupName, page, dataPerPage } }) => {
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
                groupName ? eq(profiles.group, groupName) : undefined,
              ),
            );

          const paginatedData = returned.slice(
            dataPerPage * (page - 1),
            dataPerPage * page,
          );

          return {
            ok: true,
            data: paginatedData.map((row) => ({
              nim: row.nim,
              name: row.name,
              group: row.group,
              presence: row.presence,
            })),
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
  /**
   * Get the complete presence of all events
   * @returns TAttendance[]
   * @WARNING This query is not recommended to be called for the front end as this is a heavy query
   * and no pagination is implemented
   */
  getCompletePresence: publicProcedure.query<
    TPresenceBaseResponse<TAttendance[]>
  >(async () => {
    try {
      const q = await db
        .select({
          nim: users.nim,
          name: profiles.name,
          group: profiles.group,
          presence: eventPresences.presenceType,
          day: events.day,
          openingOrClosing: eventPresences.presenceEvent,
        })
        .from(events)
        .innerJoin(eventPresences, eq(events.id, eventPresences.eventId))
        .innerJoin(users, eq(users.nim, eventPresences.userNim))
        .innerJoin(profiles, eq(profiles.userId, users.id));

      const groupingMap = new Map<
        {
          day: EventDay;
          openingOrClosing: PresenceEvent;
        },
        TAttendanceOfAnEvent
      >();

      q.forEach((row) => {
        const key = {
          day: row.day,
          openingOrClosing: row.openingOrClosing,
        };

        if (!groupingMap.has(key)) {
          groupingMap.set(key, []);
        }

        groupingMap.get(key)?.push({
          nim: row.nim,
          name: row.name,
          group: row.group,
          presence: row.presence,
        });
      });

      const returned: TAttendance[] = [];
      groupingMap.forEach((value, key) => {
        returned.push({
          day: key.day,
          openingOrClosing: key.openingOrClosing,
          attendance: value,
        });
      });

      return {
        ok: true,
        message: "Success get all presence",
        data: returned,
      };
    } catch (error) {
      return {
        ok: false,
        message: "Internal server error",
        data: null,
      };
    }
  }),

  // Mamet
  // Status: Tested
  editPresence: publicProcedure
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
  addPresence: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        openingOrClosing: z.enum(["Opening", "Closing"]),
      }),
    )
    .mutation<TPresenceBaseResponse<null>>(
      async ({ input: { eventId, openingOrClosing } }) => {
        try {
          const rolePesertaUsers = await db
            .select({ nim: users.nim })
            .from(users)
            .where(eq(users.role, "Peserta"));

          // Now we have all the nim of the Peserta
          // We can insert them all into the eventPresences table
          const insertData = rolePesertaUsers.map((row) => ({
            eventId,
            userNim: row.nim,
            presenceType: "Alpha" as PresenceType,
            presenceEvent: openingOrClosing,
            updatedAt: new Date(),
          }));

          await db.insert(eventPresences).values(insertData);

          return {
            ok: true,
            message: "Success add presence",
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
            presence: row.presence 
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
            filename: `presence_${eventId}_${openingOrClosing}.csv`,
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
            eq(users.role, "Peserta"),
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
          eventId: eventPresences.eventId,
          eventDay: events.day,
          eventOpeningOrClosing: eventPresences.presenceEvent,
          eventDate: events.eventDate,
          startTime: events.openingOpenPresenceTime,
          endTime: events.openingClosePresenceTime,
        })
        .from(eventPresences)
        .innerJoin(events, eq(events.id, eventPresences.eventId))
        .orderBy(desc(events.eventDate), desc(events.openingOpenPresenceTime));

      const paginatedData = eventsWithPresence.slice(
        dataPerPage * (page - 1),
        dataPerPage * page,
      );

      return paginatedData;
    }),
});
