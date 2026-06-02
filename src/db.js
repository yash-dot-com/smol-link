// src/db.ts
// driver - serverless neon - serverless driver handles the websocket pooling automatically, avoiding connection exhausation in serverless environment
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

// create serverless neon client (HTTP transport)
const sql = neon(process.env.POSTGRES_URL);
// create typesafe drizzle instance and pass the client in
export const db = drizzle({ client: sql });

// setup drizzle.config.js / ts 
// 
// write schemas
// npx drizzle-kit generate - converts typescript code to SQL 
// npx drizzle-kit migrate - pushes the SQL to live database
 