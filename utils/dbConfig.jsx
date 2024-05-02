import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://Expenses_Track_owner:uKA5V4iPYoML@ep-small-tree-a5d44h7a.us-east-2.aws.neon.tech/Expenses_Track?sslmode=require"
);
export const db = drizzle(sql, { schema });
