// Router ini digunakan untuk segala yang berkaitan dengan presence (absensi)
import {
  eventPresences,
  events,
  groups,
  profiles,
  users,
} from "@katitb2024/database";
import { profile } from "console";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

type TAttendanceOfAnEvent = {
  nim: string;
  name: string;
  group: string;
  presence: "Hadir" | "Izin/Sakit" | "Alpha";
}[];

type TAttendance = {
  day: "Day 1" | "Day 2" | "Day 3" | "Day 4";
  openingOrClosing: "Opening" | "Closing";
  attendance: TAttendanceOfAnEvent;
};

export const presenceRouter = createTRPCRouter({
  // Mentor (and perhaps Mamet?)
  getPresenceOfAnEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        groupName: z.string().optional(),
      }),
    )
    .query<TAttendanceOfAnEvent>(async ({ input: { eventId, groupName } }) => {
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

      return returned;
    }),

  // Mamet
  getCompletePresence: publicProcedure.query<TAttendance[]>(async () => {
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
        day: "Day 1" | "Day 2" | "Day 3" | "Day 4";
        openingOrClosing: "Opening" | "Closing";
      },
      TAttendanceOfAnEvent
    >();

    q.forEach((row) => {
      const key = {
        day: row.day as "Day 1" | "Day 2" | "Day 3" | "Day 4",
        openingOrClosing: row.openingOrClosing as "Opening" | "Closing",
      };

      if (!groupingMap.has(key)) {
        groupingMap.set(key, []);
      }

      groupingMap.get(key)?.push({
        nim: row.nim,
        name: row.name,
        group: row.group,
        presence: row.presence as "Hadir" | "Izin/Sakit" | "Alpha",
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

    return returned;
  }),

  // Mamet
  editPresence: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        nim: z.string(),
        presence: z.union([
          z.literal("Hadir"),
          z.literal("Izin/Sakit"),
          z.literal("Alpha"),
        ]),
      }),
    )
    .mutation(async ({ input: { eventId, nim, presence } }) => {
      await db
        .update(eventPresences)
        .set({
          presenceType: presence,
        })
        .where(
          and(
            eq(eventPresences.eventId, eventId),
            eq(eventPresences.userNim, nim),
          ),
        );
    }),
});
