-- =========================================================
-- NOTICES TARGET BATCH MIGRATION
-- =========================================================

-- Safely append target_batch column with default value 'All Students'
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS target_batch TEXT DEFAULT 'All Students';
