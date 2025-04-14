import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("Article").select("*").limit(1);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Database connection error:", error);
    return { success: false, error };
  }
}
