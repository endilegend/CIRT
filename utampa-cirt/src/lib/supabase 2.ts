import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://thpwxsppkxnigxysuvpb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocHd4c3Bwa3huaWd4eXN1dnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIzOTIwNCwiZXhwIjoyMDU5ODE1MjA0fQ.JpXIFJ4UpeWxY7NP86-K3QTzD5SS3qPPBT7qZBtIsGI";

export const supabase = createClient(supabaseUrl, supabaseKey);
