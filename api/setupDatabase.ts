// api/setupDatabase.ts (for Vercel Edge Functions)
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL); // Make sure DATABASE_URL is set in Vercel env variables

export default async (req: Request, ctx: ExecutionContext) => {
  try {
    // SQL query to create a `user_data` table
    await sql`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        data JSONB
      )
    `;

    // Return success response
    return new Response('Database setup successful', { status: 200 });
  } catch (error) {
    console.error('Error setting up database:', error);
    return new Response('Failed to set up database', { status: 500 });
  }
};

export const config = {
  runtime: 'edge', // For edge function on Vercel
  regions: ['iad1'], // Specify region for Neon DB
};
