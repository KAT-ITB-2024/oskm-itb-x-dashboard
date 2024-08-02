import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@katitb2024/database";
import { env } from "~/env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.x
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);

globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
