import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://nfahvsssiokaprylfrxv.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mYWh2c3NzaW9rYXByeWxmcnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDg2MDEsImV4cCI6MjA3OTkyNDYwMX0.yiq_rqI7_EDNX3eAnK50pgafFjZICoCrhnf8IStwpKs"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)