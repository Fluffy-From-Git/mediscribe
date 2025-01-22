import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

const psql = neon(DATABASE_URL);

const db = drizzle(psql, { schema });

export default db;
