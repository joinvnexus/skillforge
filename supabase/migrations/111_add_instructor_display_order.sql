-- ============================================
-- Migration: 111_add_instructor_display_order
-- Purpose: Add display_order column to instructors table
-- Created: 2026-02-08
-- ============================================

-- Add display_order column to instructors table (if it doesn't exist)
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing records to have sequential display_order values
WITH ranked_instructors AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
    FROM instructors
    WHERE display_order = 0
)
UPDATE instructors i
SET display_order = r.new_order
FROM ranked_instructors r
WHERE i.id = r.id;

-- Create index for display_order
CREATE INDEX IF NOT EXISTS idx_instructors_display_order ON instructors(display_order);

-- Verify the column was added
SELECT 'display_order column added successfully' as status;
