-- ============================================
-- RLS Policies: learning_paths
-- Purpose: Define access control for learning_paths table
-- Created: 2026-02-07
-- Table: learning_paths
-- ============================================

-- Drop existing policies if they exist (for idempotent re-runs)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Learning paths are viewable by everyone" ON learning_paths;
    DROP POLICY IF EXISTS "Public can view published learning paths" ON learning_paths;
    DROP POLICY IF EXISTS "Admins can manage all learning paths" ON learning_paths;
END $$;

-- Policy 1: Public read access to published learning paths
-- Everyone can view learning paths that are published
CREATE POLICY "Public can view published learning paths" ON learning_paths
    FOR SELECT
    USING (is_published = true);

-- Policy 2: Admins have full access to all learning paths
-- Admin users can create, update, delete learning paths
CREATE POLICY "Admins can manage all learning paths" ON learning_paths
    FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 3: View draft learning paths for admins/editors
-- Uncomment if you want admins to see drafts
/*
CREATE POLICY "Admins can view draft learning paths" ON learning_paths
    FOR SELECT
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );
*/

-- Production considerations:
-- - Consider adding an 'enrolled' status for user progress tracking
-- - Add user_enrollments table for tracking learning path progress
-- - Consider adding soft delete (is_deleted flag) instead of hard delete
