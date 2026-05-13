import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

// Create a no-op sql function for when DATABASE_URL is not set (e.g., during build)
export const sql = databaseUrl
  ? neon(databaseUrl)
  : (() => {
      console.warn("DATABASE_URL is not set. Contact form will not save to database.");
      return async () => [];
    })();

export async function createContactEntry(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!databaseUrl) {
    console.warn("Cannot save contact: DATABASE_URL is not configured");
    return { success: false, error: "Database not configured" };
  }

  try {
    const result = await sql`
      INSERT INTO contacts (name, email, message)
      VALUES (${data.name}, ${data.email}, ${data.message})
      RETURNING id, name, email, message, created_at;
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to save contact" };
  }
}
