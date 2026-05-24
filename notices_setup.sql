-- =========================================================
-- NOTICES FEATURE DATABASE SETUP
-- =========================================================

-- 1. Create notices table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Disable Row Level Security (matches public tables in this codebase)
ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;

-- 3. Configure Realtime replica identity
ALTER TABLE public.notices REPLICA IDENTITY FULL;

-- 4. Safely add to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' and tablename = 'notices') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notices;
  END IF;
END $$;
