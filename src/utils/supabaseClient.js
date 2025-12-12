// File: src/utils/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL atau Key tidak ditemukan. Cek file .env !");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
