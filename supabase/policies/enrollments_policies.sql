-- ============================================
-- RLS Policies: enrollments
-- Purpose: Define access control for enrollments table
-- Created: From refactored supabase-schema.sql
-- Table: enrollments
-- ============================================

DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

-- Policy 1: Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can create their own enrollments
CREATE POLICY "Users can create their own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own enrollments (progress updates)
CREATE POLICY "Users can update their own enrollments" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments" ON enrollments
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );
