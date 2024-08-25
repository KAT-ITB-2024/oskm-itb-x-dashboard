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
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createForgotToken: publicProcedure
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
  resetPassword: publicProcedure
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

  // GET All Mentee By Keluarga + Search Query
  getMenteeByKeluarga: publicProcedure
    .input(
      z.object({
        keluarga: z.string(),
        search: z.string().default("").optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const res = await db
          .select({
            id: users.id,
            nim: users.nim,
            nama: profiles.name,
          })
          .from(users)
          .fullJoin(profiles, eq(users.id, profiles.userId))
          .fullJoin(groups, eq(profiles.group, groups.name))
          .where(
            and(
              eq(groups.name, input.keluarga),
              eq(users.role, roleEnum.enumValues[0]),
              input.search && input.search !== ""
                ? ilike(profiles.name, `%${input.search}%`)
                : undefined,
            ),
          );

        if (!res.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mentees Not Found",
          });
        }

        return res.map((row) => ({
          nim: row.nim,
          nama: row.nama,
        }));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to Get All Mentees from ${input.keluarga}`,
        });
      }
    }),

  // PUT Update Skor Per Mentee
  updateScore: publicProcedure
    .input(
      z.object({
        nim: z.string(),
        points: z.number().max(100).min(0),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const userProfile = await db
          .selectDistinct()
          .from(profiles)
          .fullJoin(users, eq(users.id, profiles.userId))
          .where(eq(users.nim, input.nim))
          .then((results) => results[0]);

        if (!userProfile?.profiles?.userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User not found.`,
          });
        }

        let newPoints;
        if (!userProfile.profiles.point) {
          newPoints = input.points;
        } else {
          newPoints = userProfile.profiles.point + input.points;
        }

        await db
          .update(profiles)
          .set({ point: newPoints })
          .where(eq(profiles.userId, userProfile.profiles.userId));

        return {
          success: true,
          message: "User points updated successfully.",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to Update User Points",
        });
      }
    }),

  // Procedure to get group details for Mentor
  detailKelompokMentor: publicProcedure
    .input(
      z.object({
        userNim: z.string(), // NIM of the user making the request
        search: z.string().optional().default(""), // Search mentee by name
        page: z.number().optional().default(1), // Pagination: current page
        pageSize: z.number().optional().default(10), // Pagination: page size
      }),
    )
    .query(async ({ input }) => {
      const { userNim, search, page, pageSize } = input;

      try {
        // Determine the offset for pagination
        const offset = (page - 1) * pageSize;

        // Check if the user is assigned to the given group
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

        // Fetch mentee data from the mentor's group with search and pagination
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
              eq(groups.name, mentorGroup), // Only mentees in the mentor's group
              eq(users.role, roleEnum.enumValues[0]), // Only mentees
              ilike(profiles.name, `%${search}%`), // Search by mentee name
            ),
          )
          .groupBy(users.nim, profiles.name, profiles.faculty)
          .offset(offset)
          .limit(pageSize);

        return {
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

  // Procedure to get group details for Mamet with pagination, search, filters, and sorting
  detailKelompokMamet: publicProcedure
    .input(
      z.object({
        groupName: z.string().optional(), // Group name for which details are requested
        search: z.string().optional().default(""), // Search mentee by name
        sortBy: z.enum(["nim", "nama"]).optional().default("nim"), // Sort by nim or nama
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"), // Sort order
        page: z.number().optional().default(1), // Pagination: current page
        pageSize: z.number().optional().default(10), // Pagination: page size
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
        // Determine the offset for pagination
        const offset = (page - 1) * pageSize;

        // Fetch all groups
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
              eq(users.role, roleEnum.enumValues[0]), // Only mentees
              groupName ? eq(groups.name, groupName) : undefined, // Filter by keluarga if provided
            ),
          )
          .groupBy(groups.name);

        // Fetch mentee data from all groups with search, filters, sorting, and pagination
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
              eq(users.role, roleEnum.enumValues[0]), // Only mentees
              ilike(profiles.name, `%${search}%`), // Search by mentee name
              groupName ? eq(groups.name, groupName) : undefined, // Filter by keluarga if provided
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
          ) // Sorting
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
});
