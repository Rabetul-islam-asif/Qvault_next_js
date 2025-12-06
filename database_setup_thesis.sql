-- ============================================
-- QVault - Thesis Papers Feature
-- Database Setup Script
-- ============================================

-- Create thesis_papers table (approved theses)
CREATE TABLE IF NOT EXISTS thesis_papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  studentId TEXT,
  dept TEXT,
  year INTEGER,
  semester TEXT,
  supervisorId TEXT,
  abstract TEXT,
  fileUrl TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT NOW()
);

-- Create pending_thesis_papers table (awaiting approval)
CREATE TABLE IF NOT EXISTS pending_thesis_papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  studentId TEXT,
  dept TEXT,
  year INTEGER,
  semester TEXT,
  supervisorId TEXT,
  abstract TEXT,
  fileUrl TEXT NOT NULL,
  uploadedAt TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE thesis_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_thesis_papers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Enable read access for all users" ON thesis_papers
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON pending_thesis_papers
  FOR SELECT USING (true);

-- Create policies to allow insert for authenticated users
CREATE POLICY "Enable insert for all users" ON pending_thesis_papers
  FOR INSERT WITH CHECK (true);

-- Create policies for delete (typically for admin only, but allowing for now)
CREATE POLICY "Enable delete for all users" ON thesis_papers
  FOR DELETE USING (true);

CREATE POLICY "Enable delete for all users" ON pending_thesis_papers
  FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_thesis_dept ON thesis_papers(dept);
CREATE INDEX IF NOT EXISTS idx_thesis_year ON thesis_papers(year);
CREATE INDEX IF NOT EXISTS idx_thesis_supervisor ON thesis_papers(supervisorId);
CREATE INDEX IF NOT EXISTS idx_pending_thesis_dept ON pending_thesis_papers(dept);

-- ============================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 5. Verify both tables appear in Table Editor
-- ============================================
