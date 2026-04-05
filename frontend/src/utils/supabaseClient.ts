import { createClient } from "@supabase/supabase-js";

// Make sure to use the NEXT_PUBLIC environment variables so they are accessible on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
