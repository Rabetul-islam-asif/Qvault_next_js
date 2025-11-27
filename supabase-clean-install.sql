-- QVault Database Setup - Clean Installation
-- This will DROP existing tables and create them fresh with correct structure

-- WARNING: This will delete all existing data in these tables!
-- Only run this if you're okay with losing existing data.

-- 1. Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.papers CASCADE;
DROP TABLE IF EXISTS public.pending_papers CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;

-- 2. Create teachers table
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

-- 3. Create papers table
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

-- 4. Create pending_papers table
CREATE TABLE public.pending_papers (
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

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_papers ENABLE ROW LEVEL SECURITY;

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

-- 9. Insert sample data for testing
INSERT INTO public.teachers (name, designation, department, email) VALUES
  ('asif', 'Assistant Professor', 'CSE', 'asif@example.com'),
  ('Nazmus Sakib', 'Lecturer', 'CSE', 'sakib@example.com');

-- 10. Insert sample paper
INSERT INTO public.papers (course_code, course_name, semester, exam, dept, type, teacher_id, file_url)
SELECT 
  'CSE105', 
  'Object Oriented Programming Laboratory', 
  'Winter 2024', 
  'Final', 
  'CSE', 
  'lab', 
  id, 
  'https://example.com/sample.pdf'
FROM public.teachers 
WHERE name = 'asif' 
LIMIT 1;

-- 11. Create indexes for better performance
CREATE INDEX idx_papers_course_code ON public.papers(course_code);
CREATE INDEX idx_papers_dept ON public.papers(dept);
CREATE INDEX idx_papers_semester ON public.papers(semester);
CREATE INDEX idx_teachers_department ON public.teachers(department);

-- Done! Tables created successfully.
