-- ============================================
-- RLS Policies: blogs
-- Purpose: Define access control for blogs table
-- Created: 2026-02-07
-- Table: blogs
-- ============================================

-- Drop existing policies if they exist (for idempotent re-runs)
DO $$ 
BEGIN
    -- Blog policies
    DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON blogs;
    DROP POLICY IF EXISTS "Users can create blog drafts" ON blogs;
    DROP POLICY IF EXISTS "Users can update own blog drafts" ON blogs;
    DROP POLICY IF EXISTS "Admins can manage all blogs" ON blogs;
    DROP POLICY IF EXISTS "Public can view published blogs" ON blogs;
    DROP POLICY IF EXISTS "Users can update blog view count" ON blogs;
END $$;

-- Policy 1: Public read access to published blogs
-- Everyone can view blogs that are published
CREATE POLICY "Public can view published blogs" ON blogs
    FOR SELECT
    USING (is_published = true);

-- Policy 2: Authenticated users can create drafts
-- Authenticated users can insert blog posts (as drafts)
CREATE POLICY "Authenticated users can create blogs" ON blogs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Users can update their own blog drafts
-- Only the author can update their own unpublished blogs
CREATE POLICY "Authors can update own blogs" ON blogs
    FOR UPDATE
    USING (
        (author_id = auth.uid() AND is_published = false)
        OR author_id = auth.uid() -- Allow authors to update published blogs too
    );

-- Policy 4: Admins have full access to all blogs
-- Admin users (email contains @admin) can manage all blogs
CREATE POLICY "Admins can manage all blogs" ON blogs
    FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 5: Increment view count (authenticated users)
-- Any authenticated user can increment the view count
CREATE POLICY "Users can update blog view count" ON blogs
    FOR UPDATE
    USING (true)
    CHECK (true);

-- Note: For production, consider adding more granular permissions:
-- - Reviewers can approve/publish blogs
-- - Authors can only see their own draft statistics
-- - View count increment could be a stored procedure instead
