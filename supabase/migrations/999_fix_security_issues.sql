-- ============================================
-- Migration: 999_fix_security_issues
-- Purpose: Fix SECURITY DEFINER, RLS policies, and search_path issues
-- Created: 2026-02-09
-- ============================================

-- FIX 1: Add search_path to increment_blog_view_count function
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_uuid UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.search_path', 'public', false);
    UPDATE blogs
    SET view_count = view_count + 1
    WHERE id = blog_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public', 'auth';

-- FIX 2: Remove inline RLS policies from learning_path_courses (if exist)
DROP POLICY IF EXISTS "Learning path courses are viewable by everyone" ON learning_path_courses;
DROP POLICY IF EXISTS "Admins can manage learning path courses" ON learning_path_courses;

-- FIX 3: Add centralized RLS policies for learning_path_courses
CREATE POLICY "Learning path courses are viewable by everyone" ON learning_path_courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage learning path courses" ON learning_path_courses
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    )
    WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );
