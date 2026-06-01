import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

// don't really need to pass the sql variable inside drizzle as per the documentation
export const db = drizzle();
