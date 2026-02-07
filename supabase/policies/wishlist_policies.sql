-- ============================================
-- RLS Policies: wishlist and course_progress
-- Purpose: Define access control for wishlist and course_progress tables
-- Created: From refactored supabase-schema.sql
-- Tables: wishlist, course_progress
-- ============================================

DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Admins can manage all wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can view their own progress" ON course_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON course_progress;

-- ============================================
-- Wishlist Policies
-- ============================================

-- Policy 1: Users can view their own wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can manage their own wishlist (add/remove)
CREATE POLICY "Users can manage their own wishlist" ON wishlist
    FOR ALL USING (auth.uid() = user_id);

-- Policy 3: Admins can view all wishlists
CREATE POLICY "Admins can view all wishlist" ON wishlist
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- ============================================
-- Course Progress Policies
-- ============================================

-- Policy 1: Users can view their own course progress
CREATE POLICY "Users can view their own progress" ON course_progress
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM enrollments WHERE id = course_progress.enrollment_id
        )
    );

-- Policy 2: Users can update their own course progress
CREATE POLICY "Users can update their own progress" ON course_progress
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM enrollments WHERE id = course_progress.enrollment_id
        )
    );

-- Policy 3: Admins can manage all course progress
CREATE POLICY "Admins can manage all progress" ON course_progress
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );
