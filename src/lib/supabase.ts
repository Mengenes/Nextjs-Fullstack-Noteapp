import { createClient } from "@supabase/supabase-js";

const SupabaseURL=process.env.SUPABASE_URL 
const supabaseKey=process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!SupabaseURL) {
  throw new Error("SUPABASE_URL is not defined");
}
if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
}


export const supabase = createClient(SupabaseURL,supabaseKey)
