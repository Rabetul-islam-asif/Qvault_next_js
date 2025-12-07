-- Add new columns to thesis_papers
ALTER TABLE public.thesis_papers 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'thesis',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'theory',
ADD COLUMN IF NOT EXISTS project_link TEXT;

-- Add new columns to pending_thesis_papers
ALTER TABLE public.pending_thesis_papers 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'thesis',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'theory',
ADD COLUMN IF NOT EXISTS project_link TEXT;

-- Add check constraints (optional but good practice)
-- ALTER TABLE public.thesis_papers ADD CONSTRAINT thesis_type_check CHECK (type IN ('thesis', 'project'));
-- ALTER TABLE public.thesis_papers ADD CONSTRAINT thesis_category_check CHECK (category IN ('theory', 'lab'));
