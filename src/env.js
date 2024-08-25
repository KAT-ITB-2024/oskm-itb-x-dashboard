import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    MAILER_FROM: z.string(),
    MAILER_CLIENT_ID: z.string(),
    MAILER_CLIENT_SECRET: z.string(),
    MAILER_REFRESH_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_DO_ACCESS_KEY: z.string().optional(),
    NEXT_PUBLIC_DO_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_DO_ORIGIN_ENDPOINT: z.string().optional(),
    NEXT_PUBLIC_DO_BUCKET_NAME: z.string().optional(),
    NEXT_PUBLIC_DO_REGION: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MAILER_FROM: process.env.MAILER_FROM,
    MAILER_CLIENT_ID: process.env.MAILER_CLIENT_ID,
    MAILER_CLIENT_SECRET: process.env.MAILER_CLIENT_SECRET,
    MAILER_REFRESH_TOKEN: process.env.MAILER_REFRESH_TOKEN,
    NEXT_PUBLIC_DO_ACCESS_KEY: process.env.NEXT_PUBLIC_DO_ACCESS_KEY,
    NEXT_PUBLIC_DO_SECRET_KEY: process.env.NEXT_PUBLIC_DO_SECRET_KEY,
    NEXT_PUBLIC_DO_ORIGIN_ENDPOINT: process.env.NEXT_PUBLIC_DO_ORIGIN_ENDPOINT,
    NEXT_PUBLIC_DO_BUCKET_NAME: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
    NEXT_PUBLIC_DO_REGION: process.env.NEXT_PUBLIC_DO_REGION,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
