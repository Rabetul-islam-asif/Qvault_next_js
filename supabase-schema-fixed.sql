-- QVault Database Schema for Supabase (Fixed Version)
-- This version handles existing tables and adds missing columns

-- 1. Check and update teachers table
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.teachers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='designation') THEN
        ALTER TABLE public.teachers ADD COLUMN designation TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='department') THEN
        ALTER TABLE public.teachers ADD COLUMN department TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='email') THEN
        ALTER TABLE public.teachers ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='phone') THEN
        ALTER TABLE public.teachers ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='image_url') THEN
        ALTER TABLE public.teachers ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='bio') THEN
        ALTER TABLE public.teachers ADD COLUMN bio TEXT;
    END IF;
END $$;

-- 2. Check and update papers table
DO $$ 
BEGIN
    CREATE TABLE IF NOT EXISTS public.papers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        course_code TEXT NOT NULL,
        course_name TEXT NOT NULL,
        semester TEXT NOT NULL,
        exam TEXT NOT NULL,
        dept TEXT NOT NULL,
        type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    
    -- Add teacher_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='papers' AND column_name='teacher_id') THEN
        ALTER TABLE public.papers ADD COLUMN teacher_id UUID REFERENCES public.teachers(id);
    END IF;
    
    -- Add type constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'papers_type_check') THEN
        ALTER TABLE public.papers ADD CONSTRAINT papers_type_check CHECK (type IN ('theory', 'lab'));
    END IF;
END $$;

-- 3. Check and update pending_papers table
DO $$ 
BEGIN
    CREATE TABLE IF NOT EXISTS public.pending_papers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        course_code TEXT NOT NULL,
        course_name TEXT NOT NULL,
        semester TEXT NOT NULL,
        exam TEXT NOT NULL,
        dept TEXT NOT NULL,
        type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    
    -- Add teacher_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pending_papers' AND column_name='teacher_id') THEN
        ALTER TABLE public.pending_papers ADD COLUMN teacher_id TEXT;
    END IF;
    
    -- Add type constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pending_papers_type_check') THEN
        ALTER TABLE public.pending_papers ADD CONSTRAINT pending_papers_type_check CHECK (type IN ('theory', 'lab'));
    END IF;
END $$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_papers ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public read access on papers" ON public.papers;
DROP POLICY IF EXISTS "Allow public read access on pending_papers" ON public.pending_papers;
DROP POLICY IF EXISTS "Allow public insert on pending_papers" ON public.pending_papers;
DROP POLICY IF EXISTS "Allow authenticated insert on papers" ON public.papers;
DROP POLICY IF EXISTS "Allow authenticated delete on papers" ON public.papers;
DROP POLICY IF EXISTS "Allow authenticated delete on pending_papers" ON public.pending_papers;
DROP POLICY IF EXISTS "Allow authenticated insert on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow authenticated update on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow authenticated delete on teachers" ON public.teachers;

-- 6. Create policies to allow public read access
CREATE POLICY "Allow public read access on teachers"
  ON public.teachers FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on papers"
  ON public.papers FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on pending_papers"
  ON public.pending_papers FOR SELECT
  USING (true);

-- 7. Create policies to allow public insert (for uploads)
CREATE POLICY "Allow public insert on pending_papers"
  ON public.pending_papers FOR INSERT
  WITH CHECK (true);

-- 8. Create policies for authenticated users (admin operations)
CREATE POLICY "Allow authenticated insert on papers"
  ON public.papers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on papers"
  ON public.papers FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on pending_papers"
  ON public.pending_papers FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on teachers"
  ON public.teachers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on teachers"
  ON public.teachers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on teachers"
  ON public.teachers FOR DELETE
  TO authenticated
  USING (true);

-- 9. Insert sample data for testing (only if tables are empty)
INSERT INTO public.teachers (name, designation, department, email)
SELECT 'asif', 'Assistant Professor', 'CSE', 'asif@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.teachers WHERE name = 'asif');

INSERT INTO public.teachers (name, designation, department, email)
SELECT 'Nazmus Sakib', 'Lecturer', 'CSE', 'sakib@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.teachers WHERE name = 'Nazmus Sakib');

-- 10. Insert sample paper
DO $$
DECLARE
  teacher_id_var UUID;
BEGIN
  SELECT id INTO teacher_id_var FROM public.teachers WHERE name = 'asif' LIMIT 1;
  
  IF teacher_id_var IS NOT NULL THEN
    INSERT INTO public.papers (course_code, course_name, semester, exam, dept, type, teacher_id, file_url)
    SELECT 'CSE105', 'Object Oriented Programming Laboratory', 'Winter 2024', 'Final', 'CSE', 'lab', teacher_id_var, 'https://example.com/sample.pdf'
    WHERE NOT EXISTS (SELECT 1 FROM public.papers WHERE course_code = 'CSE105' AND exam = 'Final');
  END IF;
END $$;

-- 11. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_papers_course_code ON public.papers(course_code);
CREATE INDEX IF NOT EXISTS idx_papers_dept ON public.papers(dept);
CREATE INDEX IF NOT EXISTS idx_papers_semester ON public.papers(semester);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON public.teachers(department);
