-- Add courses column to teachers table
-- Run this SQL in your Supabase SQL Editor

-- Add the courses column to store course history
ALTER TABLE public.teachers 
ADD COLUMN IF NOT EXISTS courses JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN public.teachers.courses IS 'JSON array of course history objects with structure: {code: string, name: string, ongoing: boolean}';
