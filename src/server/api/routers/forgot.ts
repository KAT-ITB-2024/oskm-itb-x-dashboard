import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "@katitb2024/database";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { hash } from "bcrypt";

import { createTransport } from "nodemailer";
import { google } from "googleapis";
import type Mail from "nodemailer/lib/mailer";
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    env.MAILER_CLIENT_ID,
    env.MAILER_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  oauth2Client.setCredentials({
    refresh_token: env.MAILER_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = createTransport({
    // eslint-disable-next-line
    // @ts-ignore
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: env.MAILER_FROM,
      accessToken,
      clientId: env.MAILER_CLIENT_ID,
      clientSecret: env.MAILER_CLIENT_SECRET,
      refreshToken: env.MAILER_REFRESH_TOKEN,
    },
  });

  await transporter.verify();

  return transporter;
};

// Based on: https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
const sendEmail = async (emailOptions: Mail.Options) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail({ ...emailOptions, from: env.MAILER_FROM });
};

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

      try {
        await sendEmail({
          subject: "Forgot Password OSKM Dashboard",
          text: `This link valid for 1 hour: ${URL}`,
          to: email,
        });
      } catch (error) {
        console.error("Failed to send email: ", error);
        console.log(`Forgot password URL: ${URL}`);
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
      forgotToken[input.email] = undefined;
    }),
});
