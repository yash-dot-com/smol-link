import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const urlsTable = pgTable("urls",{
    id: serial().primaryKey(),
    originalUrl: varchar().unique(),
    shortCode: varchar().unique(),
  userId: serial().references(() => usersTable.id),
   clickCount: integer().default(0),
    createdAt: timestamp().defaultNow()
})