-- ============================================
-- RLS Policies: reviews
-- Purpose: Define access control for reviews table
-- Created: From refactored supabase-schema.sql
-- Table: reviews
-- ============================================

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;

-- Policy 1: Public read access to reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

-- Policy 2: Users can create reviews for courses they're enrolled in
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM enrollments 
            WHERE user_id = auth.uid() 
            AND course_id = reviews.course_id
        )
    );

-- Policy 3: Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Note: Reviews trigger will update course average rating automatically
