// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import {
  groups,
  profiles,
  roleEnum,
  assignmentSubmissions,
  eventPresences,
  users,
} from "@katitb2024/database";
import { and, count, eq, ilike, asc, desc } from "drizzle-orm";
import { hash } from "bcrypt";
import { sendEmail } from "~/services/mail";
import {
  clearToken,
  createToken,
  forgotPasswordURL,
  validateToken,
} from "~/services/forgotToken";
import { createTRPCRouter, mentorMametProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createForgotToken: mentorMametProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input: { email } }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found",
        });

      const token = createToken(email);
      const data = { email, token };
      const URL = `${forgotPasswordURL}?${new URLSearchParams(data).toString()}`;

      try {
        await sendEmail({
          subject: "Forgot Password OSKM Dashboard",
          text: `This link valid for 1 hour: ${URL}`,
          to: email,
        });
      } catch (error) {
        console.error("Failed to send email: ", error);
        console.log(`Forgot password URL: ${URL}`);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email, try again later",
        });
      }
    }),
  resetPassword: mentorMametProcedure
    .input(
      z.object({
        email: z.string(),
        token: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const isValid = validateToken(input);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      await db
        .update(users)
        .set({
          password: await hash(input.password, 10),
        })
        .where(eq(users.email, input.email));
      clearToken(input.email);
    }),

  // Procedure to get group details for Mentor
  detailKelompokMentor: mentorMametProcedure
    .input(
      z.object({
        userNim: z.string(), // NIM of the user making the request
        search: z.string().optional().default(""), // Search mentee by name
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const { userNim, search, page, pageSize } = input;

      try {
        const offset = (page - 1) * pageSize;

        const mentorGroup = await db
          .select({ namaKeluarga: groups.name })
          .from(groups)
          .fullJoin(profiles, eq(profiles.group, groups.name))
          .fullJoin(users, eq(users.id, profiles.userId))
          .where(eq(users.nim, userNim))
          .then((res) => res[0]?.namaKeluarga);

        if (!mentorGroup) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Mentor is not assigned to any group.",
          });
        }

        const menteesData = await db
          .select({
            nim: users.nim,
            nama: profiles.name,
            fakultas: profiles.faculty,
            tugasDikumpulkan: count(assignmentSubmissions.id),
            kehadiran: count(eventPresences.id),
            activityPoints: users.activityPoints,
          })
          .from(users)
          .fullJoin(profiles, eq(users.id, profiles.userId))
          .fullJoin(groups, eq(profiles.group, groups.name))
          .leftJoin(
            assignmentSubmissions,
            eq(assignmentSubmissions.userNim, users.nim),
          )
          .leftJoin(eventPresences, eq(eventPresences.userNim, users.nim))
          .where(
            and(
              eq(groups.name, mentorGroup), // Only mentees in the mentor's group
              eq(users.role, roleEnum.enumValues[0]),
              ilike(profiles.name, `%${search}%`),
            ),
          )
          .groupBy(
            users.nim,
            profiles.name,
            profiles.faculty,
            users.activityPoints,
          )
          .offset(offset)
          .limit(pageSize);

        return {
          mentees: menteesData.map((mentee) => ({
            nim: mentee.nim,
            nama: mentee.nama,
            fakultas: mentee.fakultas,
            tugasDikumpulkan: mentee.tugasDikumpulkan,
            kehadiran: mentee.kehadiran,
            activityPoints: mentee.activityPoints,
          })),
          page,
          pageSize,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get group details." + String(error),
          cause: error,
        });
      }
    }),

  // Procedure to get group details for Mamet
  detailKelompokMamet: mentorMametProcedure
    .input(
      z.object({
        groupName: z.string().optional(), // Group name for which details are requested
        search: z.string().optional().default(""), // Search mentee by name
        sortBy: z.enum(["nim", "nama"]).optional().default("nim"), // Sort by nim or nama
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"), // Sort order
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const {
        search,
        groupName, // Group name for which details are requested
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = input;

      try {
        const offset = (page - 1) * pageSize;

        const groupsData = await db
          .select({
            namaKeluarga: groups.name,
            jumlahMentee: count(users.id),
          })
          .from(groups)
          .fullJoin(profiles, eq(profiles.group, groups.name))
          .fullJoin(users, eq(users.id, profiles.userId))
          .where(
            and(
              eq(users.role, roleEnum.enumValues[0]),
              groupName ? eq(groups.name, groupName) : undefined,
            ),
          )
          .groupBy(groups.name);

        const menteesData = await db
          .select({
            nim: users.nim,
            nama: profiles.name,
            fakultas: profiles.faculty,
            tugasDikumpulkan: count(assignmentSubmissions.id),
            kehadiran: count(eventPresences.id),
          })
          .from(users)
          .fullJoin(profiles, eq(users.id, profiles.userId))
          .fullJoin(groups, eq(profiles.group, groups.name))
          .leftJoin(
            assignmentSubmissions,
            eq(assignmentSubmissions.userNim, users.nim),
          )
          .leftJoin(eventPresences, eq(eventPresences.userNim, users.nim))
          .where(
            and(
              eq(users.role, roleEnum.enumValues[0]),
              ilike(profiles.name, `%${search}%`),
              groupName ? eq(groups.name, groupName) : undefined,
            ),
          )
          .groupBy(users.nim, profiles.name, profiles.faculty)
          .orderBy(
            sortBy === "nim"
              ? sortOrder === "asc"
                ? asc(users.nim)
                : desc(users.nim)
              : sortOrder === "asc"
                ? asc(profiles.name)
                : desc(profiles.name),
          )
          .offset(offset)
          .limit(pageSize);

        return {
          groups: groupsData,
          mentees: menteesData.map((mentee) => ({
            nim: mentee.nim,
            nama: mentee.nama,
            fakultas: mentee.fakultas,
            tugasDikumpulkan: mentee.tugasDikumpulkan,
            kehadiran: mentee.kehadiran,
          })),
          page,
          pageSize,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get group details." + String(error),
          cause: error,
        });
      }
    }),

  // Procedure to edit activity points for a mentee
  editActivityPoints: mentorMametProcedure
    .input(
      z.object({
        userNim: z.string(),
        activityPoints: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db
          .update(users)
          .set({
            activityPoints: input.activityPoints,
          })
          .where(eq(users.nim, input.userNim));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to edit activity points." + String(error),
          cause: error,
        });
      }
    }),

  // Procedure to get mentor groupName
  getMentorGroupName: mentorMametProcedure
    .input(
      z.object({
        userNim: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userNim } = input;

      try {
        const mentorGroup = await db
          .select({ namaKeluarga: groups.name })
          .from(groups)
          .fullJoin(profiles, eq(profiles.group, groups.name))
          .fullJoin(users, eq(users.id, profiles.userId))
          .where(eq(users.nim, userNim))
          .then((res) => res[0]?.namaKeluarga);

        return mentorGroup;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get mentor group name." + String(error),
          cause: error,
        });
      }
    }),
});
