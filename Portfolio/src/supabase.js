import { createClient } from '@supabase/supabase-js'

// Clean up any trailing /rest/v1/ from the URL if present, to ensure the SDK works correctly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '') : ''
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
