import { createClient } from '@supabase/supabase-js'

// Ambil variabel dari file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cek apakah kunci ditemukan (untuk debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL atau Anon Key tidak ditemukan. Pastikan file .env sudah diisi dengan benar.")
}

// Inisialisasi klien Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)