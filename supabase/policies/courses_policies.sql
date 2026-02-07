-- ============================================
-- RLS Policies: courses and categories
-- Purpose: Define access control for courses and categories tables
-- Created: From refactored supabase-schema.sql
-- Tables: courses, categories
-- ============================================

DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Admins can update courses" ON courses;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

-- ============================================
-- Courses Policies
-- ============================================

-- Policy 1: Public read access to courses
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);

-- Policy 2: Admins can insert courses
CREATE POLICY "Admins can insert courses" ON courses
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 3: Admins can update courses
CREATE POLICY "Admins can update courses" ON courses
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );

-- Policy 4: Instructors can update their own courses (optional - uncomment if needed)
-- CREATE POLICY "Instructors can update own courses" ON courses
--     FOR UPDATE USING (instructor_id = auth.uid())
--     WITH CHECK (instructor_id = auth.uid());

-- ============================================
-- Categories Policies
-- ============================================

-- Policy: Public read access to categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Note: Only admins can insert/update/delete categories
