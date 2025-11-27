-- Step 1: Check existing table structure
-- Run this first to see what columns exist

SELECT 
    table_name,
    column_name,
    data_type
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name IN ('teachers', 'papers', 'pending_papers')
ORDER BY 
    table_name, ordinal_position;
