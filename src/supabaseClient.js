import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rfydundhsvwvikmufovf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmeWR1bmRoc3Z3dmlrbXVmb3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDk4OTMsImV4cCI6MjA3ODk4NTg5M30.8ntRnwg3jK0mJgZXjVBUiyDj_jHMLjWm6eT2GLkn-SY'

export const supabase = createClient(supabaseUrl, supabaseKey)