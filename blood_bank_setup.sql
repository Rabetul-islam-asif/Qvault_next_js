-- =========================================================
-- BLOOD BANK FEATURE SETUP
-- =========================================================

-- 1. Create blood_donors table
CREATE TABLE IF NOT EXISTS public.blood_donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  batch TEXT, -- e.g. "Batch 24"
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  contact TEXT, -- Optional
  blood_group TEXT NOT NULL, -- e.g. "A+", "O-"
  is_donor BOOLEAN DEFAULT FALSE, -- "Previous Donor" status
  willingness INTEGER CHECK (willingness >= 0 AND willingness <= 5), -- 0-5 stars
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public Read
CREATE POLICY "Public Read Blood Donors" 
  ON public.blood_donors FOR SELECT 
  USING (true);

-- Authenticated (Admin) Full Access
CREATE POLICY "Admin All Blood Donors" 
  ON public.blood_donors FOR ALL 
  TO authenticated 
  USING (true);

-- 4. Realtime Configuration
ALTER TABLE blood_donors REPLICA IDENTITY FULL;

-- Safely add to publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' and tablename = 'blood_donors') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE blood_donors;
  END IF;
END $$;
