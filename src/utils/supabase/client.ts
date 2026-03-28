import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isInvalid = !supabaseUrl || 
                   !supabaseAnonKey || 
                   supabaseUrl.includes('your-project-url-here') || 
                   !supabaseUrl.startsWith('http')

  if (isInvalid) {
    throw new Error('Supabase configuration missing or invalid. Please update your .env.local file with real credentials.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
