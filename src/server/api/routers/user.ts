// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { users } from "@katitb2024/database";
import { eq } from "drizzle-orm";
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
    detailKelompok: publicProcedure
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
        .select({count: count(assignmentSubmissions)})
        .from(assignmentSubmissions)
        .where(eq(profiles.groupNumber, input.groupNumber))
        .groupBy(users.nim)

        const countPresences = await ctx.db
        .select({count: count(eventPresences)})
        .from(eventPresences)
        .where(eq(profiles.groupNumber, input.groupNumber))
        .groupBy(users.nim)
    }),
});
