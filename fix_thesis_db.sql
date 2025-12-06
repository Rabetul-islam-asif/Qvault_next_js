-- ============================================
-- FIX SCRIPT: Add missing camelCase columns
-- ============================================

-- We use quotes to ensure case sensitivity matches the JavaScript code exactly.
-- This will create columns "studentId", "supervisorId", "fileUrl" if they don't exist.

-- 1. Update pending_thesis_papers
ALTER TABLE pending_thesis_papers ADD COLUMN IF NOT EXISTS "studentId" TEXT;
ALTER TABLE pending_thesis_papers ADD COLUMN IF NOT EXISTS "supervisorId" TEXT;
ALTER TABLE pending_thesis_papers ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;

-- 2. Update thesis_papers
ALTER TABLE thesis_papers ADD COLUMN IF NOT EXISTS "studentId" TEXT;
ALTER TABLE thesis_papers ADD COLUMN IF NOT EXISTS "supervisorId" TEXT;
ALTER TABLE thesis_papers ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;

-- 3. Verify permissions
GRANT ALL ON pending_thesis_papers TO anon, authenticated, service_role;
GRANT ALL ON thesis_papers TO anon, authenticated, service_role;

-- 4. Force schema cache reload
NOTIFY pgrst, 'reload config';
