/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.jsx",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://Expenses_Track_owner:uKA5V4iPYoML@ep-small-tree-a5d44h7a.us-east-2.aws.neon.tech/Expenses_Track?sslmode=require",
  },
};
