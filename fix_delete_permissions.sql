-- ============================================
-- FIX DELETE PERMISSIONS SCRIPT
-- ============================================

-- It seems the DELETE policies might be missing or broken.
-- This script explicitly enables DELETE for everyone on the thesis tables.

-- 1. Reset DELETE policy for thesis_papers
DROP POLICY IF EXISTS "Enable delete for all users" ON thesis_papers;
CREATE POLICY "Enable delete for all users" ON thesis_papers
  FOR DELETE USING (true);

-- 2. Reset DELETE policy for pending_thesis_papers
DROP POLICY IF EXISTS "Enable delete for all users" ON pending_thesis_papers;
CREATE POLICY "Enable delete for all users" ON pending_thesis_papers
  FOR DELETE USING (true);

-- 3. Grant DELETE permissions to all roles (just to be safe)
GRANT DELETE ON thesis_papers TO anon, authenticated, service_role;
GRANT DELETE ON pending_thesis_papers TO anon, authenticated, service_role;

-- 4. Notify Supabase to reload config
NOTIFY pgrst, 'reload config';
