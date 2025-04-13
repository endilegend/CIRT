import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://thpwxsppkxnigxysuvpb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocHd4c3Bwa3huaWd4eXN1dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5NjQ0MDAsImV4cCI6MjAyODU0MDQwMH0.8Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("article").select("*").limit(1);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Database connection error:", error);
    return { success: false, error };
  }
}
