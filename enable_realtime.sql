-- =========================================================
-- FIX REALTIME SCRIPT (IDEMPOTENT)
-- =========================================================
-- Run this script in your Supabase SQL Editor.
-- It will safely enable REPLICA IDENTITY and add tables to the
-- publication only if they are not already added.
-- =========================================================

-- 1. Enable REPLICA IDENTITY FULL
-- (Safe to run multiple times)
ALTER TABLE teachers REPLICA IDENTITY FULL;
ALTER TABLE papers REPLICA IDENTITY FULL;
ALTER TABLE pending_papers REPLICA IDENTITY FULL;
ALTER TABLE materials REPLICA IDENTITY FULL;
ALTER TABLE pending_materials REPLICA IDENTITY FULL;
ALTER TABLE thesis_papers REPLICA IDENTITY FULL;
ALTER TABLE pending_thesis_papers REPLICA IDENTITY FULL;

-- 2. Safely add tables to 'supabase_realtime'
do $$
begin
  -- TEACHERS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'teachers') then
    alter publication supabase_realtime add table teachers;
  end if;

  -- PAPERS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'papers') then
    alter publication supabase_realtime add table papers;
  end if;

  -- PENDING_PAPERS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_papers') then
    alter publication supabase_realtime add table pending_papers;
  end if;

  -- MATERIALS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'materials') then
    alter publication supabase_realtime add table materials;
  end if;

  -- PENDING_MATERIALS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_materials') then
    alter publication supabase_realtime add table pending_materials;
  end if;

  -- THESIS_PAPERS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'thesis_papers') then
    alter publication supabase_realtime add table thesis_papers;
  end if;

  -- PENDING_THESIS_PAPERS
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'pending_thesis_papers') then
    alter publication supabase_realtime add table pending_thesis_papers;
  end if;
end;
$$;
