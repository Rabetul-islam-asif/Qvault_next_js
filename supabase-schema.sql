-- QVault Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- 1. Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
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

-- 2. Create papers table
CREATE TABLE IF NOT EXISTS public.papers (
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

-- 3. Create pending_papers table
CREATE TABLE IF NOT EXISTS public.pending_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  exam TEXT NOT NULL,
  dept TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('theory', 'lab')),
  teacher_id TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_papers ENABLE ROW LEVEL SECURITY;

-- 5. Create policies to allow public read access
CREATE POLICY "Allow public read access on teachers"
  ON public.teachers FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on papers"
  ON public.papers FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on pending_papers"
  ON public.pending_papers FOR SELECT
  USING (true);

-- 6. Create policies to allow public insert (for uploads)
CREATE POLICY "Allow public insert on pending_papers"
  ON public.pending_papers FOR INSERT
  WITH CHECK (true);

-- 7. Create policies for authenticated users (admin operations)
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

-- 8. Insert sample data for testing
INSERT INTO public.teachers (name, designation, department, email) VALUES
  ('asif', 'Assistant Professor', 'CSE', 'asif@example.com'),
  ('Nazmus Sakib', 'Lecturer', 'CSE', 'sakib@example.com')
ON CONFLICT DO NOTHING;

-- Get the teacher ID for sample paper
DO $$
DECLARE
  teacher_id_var UUID;
BEGIN
  SELECT id INTO teacher_id_var FROM public.teachers WHERE name = 'asif' LIMIT 1;
  
  IF teacher_id_var IS NOT NULL THEN
    INSERT INTO public.papers (course_code, course_name, semester, exam, dept, type, teacher_id, file_url) VALUES
      ('CSE105', 'Object Oriented Programming Laboratory', 'Winter 2024', 'Final', 'CSE', 'lab', teacher_id_var, 'https://example.com/sample.pdf')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_papers_course_code ON public.papers(course_code);
CREATE INDEX IF NOT EXISTS idx_papers_dept ON public.papers(dept);
CREATE INDEX IF NOT EXISTS idx_papers_semester ON public.papers(semester);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON public.teachers(department);
