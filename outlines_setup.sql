-- =========================================================
-- COURSE OUTLINES DATABASE SETUP
-- =========================================================

-- 1. Create course_outlines table
CREATE TABLE IF NOT EXISTS public.course_outlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE, -- One outline per course
  course_name TEXT NOT NULL,
  outline_url TEXT NOT NULL, -- Store PDF direct links or Base64 documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Disable Row Level Security (matches other public tables)
ALTER TABLE public.course_outlines DISABLE ROW LEVEL SECURITY;

-- 3. Configure Realtime replica identity
ALTER TABLE public.course_outlines REPLICA IDENTITY FULL;

-- 4. Safely add to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' and tablename = 'course_outlines') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE course_outlines;
  END IF;
END $$;
