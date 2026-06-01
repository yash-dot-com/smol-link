import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export const urlsTable = pgTable("urls",{
    urlId: serial().primaryKey(),
    longUrl: varchar().unique(),
    shortUrl: varchar().unique(),
    userId: serial().references(()=>usersTable.id)
})