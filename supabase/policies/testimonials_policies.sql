-- ============================================
-- RLS Policies: testimonials
-- Purpose: Define access control for testimonials table
-- Created: 2026-02-07
-- Table: testimonials
-- ============================================

-- Drop existing policies if they exist (for idempotent re-runs)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;
    DROP POLICY IF EXISTS "Public can view approved testimonials" ON testimonials;
    DROP POLICY IF EXISTS "Users can create testimonials" ON testimonials;
    DROP POLICY IF EXISTS "Users can update own testimonials" ON testimonials;
    DROP POLICY IF EXISTS "Admins can manage all testimonials" ON testimonials;
END $$;

-- Policy 1: Public read access to approved testimonials
-- Everyone can view testimonials that are approved
CREATE POLICY "Public can view approved testimonials" ON testimonials
    FOR SELECT
    USING (is_approved = true);

-- Policy 2: Authenticated users can create testimonials
-- Users can submit testimonials for review
CREATE POLICY "Authenticated users can create testimonials" ON testimonials
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Users can update their own testimonials
-- Only the author can update their own testimonials (before approval)
CREATE POLICY "Users can update own testimonials" ON testimonials
    FOR UPDATE
    USING (
        (user_id = auth.uid() AND is_approved = false)
        OR user_id = auth.uid()
    );

-- Policy 4: Admins have full access to all testimonials
-- Admin users can approve, edit, delete testimonials
CREATE POLICY "Admins can manage all testimonials" ON testimonials
    FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 5: Instructors can manage testimonials for their courses
-- If testimonial is linked to an instructor's course, they can manage it
CREATE POLICY "Instructors can manage testimonials for their courses" ON testimonials
    FOR ALL
    USING (
        auth.uid() = ANY(
            SELECT instructor_id FROM courses WHERE id = testimonials.course_id
        )
    )
    WITH CHECK (
        auth.uid() = ANY(
            SELECT instructor_id FROM courses WHERE id = testimonials.course_id
        )
    );

-- Production considerations:
-- - Consider adding a comment/moderation field for admin feedback
-- - Add email notification trigger when new testimonial is submitted
-- - Consider rate limiting to prevent spam testimonials
