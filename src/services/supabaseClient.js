import { createClient } from '@supabase/supabase-js'

// These must start with VITE_ prefix for Vite apps
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// console.log("SUPABASE_URL:", supabaseUrl)
// console.log("SUPABASE_KEY:", supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey)