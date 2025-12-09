-- =========================================================
-- QVAULT - COMPLETE DATABASE SETUP
-- =========================================================
-- This script sets up the entire database schema for QVault.
-- derived from: supabase-clean-install.sql, database_setup_thesis.sql, fix_thesis_rls.sql, enable_realtime.sql
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard -> SQL Editor
-- 2. Paste this entire file
-- 3. Run it
--
-- WARNING: This will DROP existing tables and data!
-- =========================================================

-- 1. CLEANUP (Drop existing tables)
DROP TABLE IF EXISTS public.papers CASCADE;
DROP TABLE IF EXISTS public.pending_papers CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.pending_materials CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.thesis_papers CASCADE;
DROP TABLE IF EXISTS public.pending_thesis_papers CASCADE;

-- 2. CREATE EXTENSIONS (If needed, PG_TRGM is often useful for search but not strictly required by current code)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. CREATE TABLES

-- TEACHERS
CREATE TABLE public.teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PAPERS
CREATE TABLE public.papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  exam TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('theory', 'lab')),
  teacher_id UUID REFERENCES public.teachers(id),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PENDING PAPERS
CREATE TABLE public.pending_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  exam TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('theory', 'lab')),
  teacher_id TEXT, -- Can be UUID or 'Additional' (text)
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MATERIALS (Inferred Structure)
CREATE TABLE public.materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'slide', 'book'
  teacher_id UUID REFERENCES public.teachers(id),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PENDING MATERIALS
CREATE TABLE public.pending_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL,
  teacher_id TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- THESIS PAPERS
CREATE TABLE public.thesis_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Changed to UUID for consistency, though original was SERIAL. Using UUID is safer for Supabase.
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  studentId TEXT,
  dept TEXT,
  year INTEGER,
  semester TEXT,
  supervisorId TEXT,
  abstract TEXT,
  fileUrl TEXT NOT NULL,
  type TEXT, -- 'thesis' or 'project'
  category TEXT, -- 'Lab' or 'Theory'
  project_link TEXT,
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PENDING THESIS PAPERS
CREATE TABLE public.pending_thesis_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  studentId TEXT,
  dept TEXT,
  year INTEGER,
  semester TEXT,
  supervisorId TEXT,
  abstract TEXT,
  fileUrl TEXT NOT NULL,
  type TEXT,
  category TEXT,
  project_link TEXT,
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ENABLE RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_thesis_papers ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES

-- Public Read Access
CREATE POLICY "Public Read Teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public Read Papers" ON public.papers FOR SELECT USING (true);
CREATE POLICY "Public Read Pending Papers" ON public.pending_papers FOR SELECT USING (true);
CREATE POLICY "Public Read Materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public Read Pending Materials" ON public.pending_materials FOR SELECT USING (true);
CREATE POLICY "Public Read Thesis" ON public.thesis_papers FOR SELECT USING (true);
CREATE POLICY "Public Read Pending Thesis" ON public.pending_thesis_papers FOR SELECT USING (true);

-- Public Insert (Submission)
CREATE POLICY "Public Insert Pending Papers" ON public.pending_papers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Pending Materials" ON public.pending_materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Pending Thesis" ON public.pending_thesis_papers FOR INSERT WITH CHECK (true);

-- Authenticated/Admin Access (Full Control)
-- Simplified policy: Authenticated users (admin) can do anything
CREATE POLICY "Admin All Teachers" ON public.teachers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Papers" ON public.papers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Pending Papers" ON public.pending_papers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Materials" ON public.materials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Pending Materials" ON public.pending_materials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Thesis" ON public.thesis_papers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Pending Thesis" ON public.pending_thesis_papers FOR ALL TO authenticated USING (true);

-- Also allow Insert/Delete on Thesis for all for now (as per legacy script `fix_thesis_rls.sql` which was very permissive)
-- Use with CAUTION. Ideally these should be restricted to authenticated users.
-- Replicating logic from `fix_thesis_rls.sql`:
CREATE POLICY "Legacy Thesis Insert" ON public.thesis_papers FOR INSERT WITH CHECK (true); 
CREATE POLICY "Legacy Thesis Delete" ON public.thesis_papers FOR DELETE USING (true);

-- 6. REALTIME CONFIGURATION
-- Enable Replica Identity Full
ALTER TABLE teachers REPLICA IDENTITY FULL;
ALTER TABLE papers REPLICA IDENTITY FULL;
ALTER TABLE pending_papers REPLICA IDENTITY FULL;
ALTER TABLE materials REPLICA IDENTITY FULL;
ALTER TABLE pending_materials REPLICA IDENTITY FULL;
ALTER TABLE thesis_papers REPLICA IDENTITY FULL;
ALTER TABLE pending_thesis_papers REPLICA IDENTITY FULL;

-- Add to Publication
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'teachers') then
    alter publication supabase_realtime add table teachers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'papers') then
    alter publication supabase_realtime add table papers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_papers') then
    alter publication supabase_realtime add table pending_papers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'materials') then
    alter publication supabase_realtime add table materials;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_materials') then
    alter publication supabase_realtime add table pending_materials;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'thesis_papers') then
    alter publication supabase_realtime add table thesis_papers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_thesis_papers') then
    alter publication supabase_realtime add table pending_thesis_papers;
  end if;
end;
$$;

-- 7. SEED DATA
INSERT INTO public.teachers (name, designation, department, email) VALUES
  ('asif', 'Assistant Professor', 'CSE', 'asif@example.com'),
  ('Nazmus Sakib', 'Lecturer', 'CSE', 'sakib@example.com');
  
-- Done
