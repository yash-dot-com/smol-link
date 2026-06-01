import { pgTable, serial, timestamp, varchar, } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users",{
    id: serial().primaryKey(),
    email: varchar().notNull().unique(),
    password: varchar().notNull(),
    createdAt: timestamp().defaultNow(),
})