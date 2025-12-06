-- ============================================
-- CLEANUP SCRIPT: Remove accidental quoted columns
-- ============================================

-- The previous fix script created columns like "fileUrl" (quoted, case-sensitive).
-- But the original table used unquoted names which Postgres converts to lowercase (fileurl).
-- We have updated the JS code to use lowercase keys (fileurl, studentid, supervisorid).
-- Now we should remove the unused quoted columns to avoid confusion.

ALTER TABLE pending_thesis_papers DROP COLUMN IF EXISTS "fileUrl";
ALTER TABLE pending_thesis_papers DROP COLUMN IF EXISTS "studentId";
ALTER TABLE pending_thesis_papers DROP COLUMN IF EXISTS "supervisorId";

ALTER TABLE thesis_papers DROP COLUMN IF EXISTS "fileUrl";
ALTER TABLE thesis_papers DROP COLUMN IF EXISTS "studentId";
ALTER TABLE thesis_papers DROP COLUMN IF EXISTS "supervisorId";

-- Verify permissions
GRANT ALL ON pending_thesis_papers TO anon, authenticated, service_role;
GRANT ALL ON thesis_papers TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload config';
