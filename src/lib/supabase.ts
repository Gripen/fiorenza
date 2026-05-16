import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
const secretKey = process.env.SUPABASE_SECRET_KEY!

// Browser client — använd i komponenter och klient-sidiga anrop
export const supabase = createClient(url, publishableKey)

// Server client — använd i API-routes och server components
export const supabaseAdmin = createClient(url, secretKey)
