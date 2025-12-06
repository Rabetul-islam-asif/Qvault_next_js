-- ============================================
-- FIX RLS SCRIPT: Allow Insert/Update on Thesis Tables
-- ============================================

-- The previous setup enabled RLS but missed the INSERT policy for 'thesis_papers'.
-- This caused the "new row violates row-level security policy" error when approving (inserting) a thesis.

-- 1. Allow INSERT on thesis_papers (Required for approval)
DROP POLICY IF EXISTS "Enable insert for all users" ON thesis_papers;
CREATE POLICY "Enable insert for all users" ON thesis_papers
  FOR INSERT WITH CHECK (true);

-- 2. Allow UPDATE on thesis_papers (Just in case)
DROP POLICY IF EXISTS "Enable update for all users" ON thesis_papers;
CREATE POLICY "Enable update for all users" ON thesis_papers
  FOR UPDATE USING (true);

-- 3. Ensure INSERT/UPDATE on pending_thesis_papers (For uploads)
DROP POLICY IF EXISTS "Enable insert for all users" ON pending_thesis_papers;
CREATE POLICY "Enable insert for all users" ON pending_thesis_papers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON pending_thesis_papers;
CREATE POLICY "Enable update for all users" ON pending_thesis_papers
  FOR UPDATE USING (true);

-- 4. Re-apply Grant Permissions (Safety check)
GRANT ALL ON thesis_papers TO anon, authenticated, service_role;
GRANT ALL ON pending_thesis_papers TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload config';
