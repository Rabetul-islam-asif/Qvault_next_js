-- ============================================
-- QVault - Thesis Papers Schema Migration
-- Add dedicated columns for Keywords & Presentation Slides
-- ============================================

-- 1. Update thesis_papers (Approved Theses)
ALTER TABLE public.thesis_papers 
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS presentation_slides TEXT;

-- 2. Update pending_thesis_papers (Awaiting Approval)
ALTER TABLE public.pending_thesis_papers 
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS presentation_slides TEXT;

-- 3. Comments describing the new columns
COMMENT ON COLUMN public.thesis_papers.keywords IS 'Comma-separated academic research keywords or tags';
COMMENT ON COLUMN public.thesis_papers.presentation_slides IS 'External Google Slides or PowerPoint presentation drive link';

-- 4. Enable Realtime Replication for updated tables
ALTER TABLE public.thesis_papers REPLICA IDENTITY FULL;
ALTER TABLE public.pending_thesis_papers REPLICA IDENTITY FULL;

-- ============================================
-- Note: Storing keywords/slides in dedicated columns 
-- enables precise, column-specific querying and search indexing!
-- ============================================
