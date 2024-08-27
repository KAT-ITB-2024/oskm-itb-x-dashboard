import { createTransport } from "nodemailer";
import type { TransportOptions } from "nodemailer";
import { google } from "googleapis";
import type Mail from "nodemailer/lib/mailer";
import { env } from "~/env";
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
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: env.MAILER_FROM,
      accessToken,
      clientId: env.MAILER_CLIENT_ID,
      clientSecret: env.MAILER_CLIENT_SECRET,
      refreshToken: env.MAILER_REFRESH_TOKEN,
    },
  } as TransportOptions);

  await transporter.verify();

  return transporter;
};

// Based on: https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
export const sendEmail = async (emailOptions: Mail.Options) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail({ ...emailOptions, from: env.MAILER_FROM });
};