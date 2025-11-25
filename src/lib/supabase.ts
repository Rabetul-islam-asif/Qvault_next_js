import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://imeykplylnqymupmofcb.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXlrcGx5bG5xeW11cG1vZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTU1NzgsImV4cCI6MjA3OTQ3MTU3OH0.YjkgJ1eWVoM4PCP9bq8qMYKmdrqiwi2JBxk2l1woYZ4"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)