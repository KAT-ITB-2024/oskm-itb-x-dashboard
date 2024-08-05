import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "@katitb2024/database";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { env } from "process";
import { hash } from "bcrypt";

const forgotToken: Record<
  string,
  | {
      token: string;
      expired: number;
    }
  | undefined
> = {};

export function validateToken({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const item = forgotToken[email];
  if (!item) return false;
  if (item.token != token) return false;
  if (Date.now() > item.expired) return false;
  return true;
}

const forgotPasswordURL = `${env.NEXTAUTH_URL}/forgot-password`;
export const forgotRouter = createTRPCRouter({
  createToken: publicProcedure
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

      const token = randomBytes(64).toString("hex");
      forgotToken[email] = {
        expired: Date.now() + 60 * 60 * 1000,
        token,
      };

      const data = { email, token };
      const URL = `${forgotPasswordURL}?${new URLSearchParams(data).toString()}`;
      console.log(`Forgot password URL: ${URL}`);
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
      forgotToken[input.email] = undefined;
    }),
});
