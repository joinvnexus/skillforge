-- ============================================
-- RLS Policies: instructors
-- Purpose: Define access control for instructors table
-- Created: 2026-02-07
-- Table: instructors
-- ============================================

-- Drop existing policies if they exist (for idempotent re-runs)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Instructors are viewable by everyone" ON instructors;
    DROP POLICY IF EXISTS "Instructors can update own profile" ON instructors;
    DROP POLICY IF EXISTS "Admins can manage all instructors" ON instructors;
    DROP POLICY IF EXISTS "Public can view active instructors" ON instructors;
END $$;

-- Policy 1: Public read access to active instructors
-- Everyone can view instructors that are active
CREATE POLICY "Public can view active instructors" ON instructors
    FOR SELECT
    USING (is_active = true);

-- Policy 2: Users can update their own instructor profile
-- If a user has an instructor profile linked to their account, they can update it
CREATE POLICY "Instructors can update own profile" ON instructors
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Policy 3: Admins have full access to all instructors
-- Admin users can manage all instructor profiles
CREATE POLICY "Admins can manage all instructors" ON instructors
    FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 4: Anonymous users can view featured instructors only
-- For more restrictive access, uncomment below:
/*
CREATE POLICY "Anonymous users view featured only" ON instructors
    FOR SELECT
    USING (is_featured = true AND is_active = true);
*/

-- Production considerations:
-- - Consider adding a status field (pending/approved) for instructor applications
-- - Add approval workflow for new instructor registrations
-- - Track who created/updated each instructor record
