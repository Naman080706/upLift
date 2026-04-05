import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials are not fully set in the environment.');
}

// Service role key is preferred in the backend for elevated access,
// but anon key works for verifying explicit user tokens.
export const supabase = createClient(supabaseUrl, supabaseKey);
