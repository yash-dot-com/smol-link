import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema.js";
import { urlsTable } from "./urls.schema.js";

export const logTable = pgTable("logs", {
  id: serial().primaryKey(),
  urlId: integer().references(()=> urlsTable.id),
  userId: integer().references(() => usersTable.id),
  shortCode: text().notNull(),
  createdAt: timestamp().defaultNow(),
  browser: text().notNull().default("unknown"),
  ip: text().notNull().default("unknown"),
  referrer: text().notNull().default("unknown"),
});
