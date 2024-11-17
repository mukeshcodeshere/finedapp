// src/db.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const saveUserData = async (userId, data) => {
  try {
    await sql`
      INSERT INTO user_data (user_id, data)
      VALUES (${userId}, ${data})
    `;
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async (userId) => {
  try {
    const [data] = await sql`
      SELECT data FROM user_data
      WHERE user_id = ${userId}
    `;
    return data ? data.data : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
