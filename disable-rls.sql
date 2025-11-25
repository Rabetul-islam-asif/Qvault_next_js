-- Disable RLS to test if that's causing the CORS errors
-- Run this to temporarily disable RLS and see if data loads

ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_papers DISABLE ROW LEVEL SECURITY;

-- After running this, refresh your application at http://localhost:3000
-- If data loads, then RLS policies were the issue
