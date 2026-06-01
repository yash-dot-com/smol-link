import { defineConfig } from "drizzle-kit"
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  schema: "./schema",
  out: "./migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  }
})