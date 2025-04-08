import { drizzle as drizzleNeonAdapter } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const sql = neon(env.DATABASE_URL);
export const db = drizzleNeonAdapter(sql, { schema });
