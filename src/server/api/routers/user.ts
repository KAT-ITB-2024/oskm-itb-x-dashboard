// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { groups, profiles, users } from "@katitb2024/database";
import { and, eq, ilike } from "drizzle-orm";
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
        keluarga: z.string(), // string untuk cari keluarga
        search: z.string().default("").optional(), // Query searching ilike opsional
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
              eq(users.role, "Peserta"),
              input.search && input.search !== ""
                ? ilike(profiles.name, `%${input.search}%`)
                : undefined,
            ),
          );

        // Null handling
        if (!res.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mentees Not Found",
          });
        }

        // List nim & nama
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
        nim: z.string(), // Query masukan nim (unik)
        points: z.number().max(100).min(0), // constraint selang 0 sampai 100 default 0
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

        // Null Handling
        if (!userProfile?.profiles?.userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User not found.`,
          });
        }

        // Menambahkan poin tambahan ke poin sekarang
        let newPoints;
        if (!userProfile.profiles.point) {
          newPoints = input.points;
        } else {
          newPoints = userProfile.profiles.point + input.points;
        }

        // Update query ke db
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
});
