import { defineConfig } from "drizzle-kit"
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migration",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  }
})