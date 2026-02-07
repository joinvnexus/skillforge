-- ============================================
-- RLS Policies: profiles
-- Purpose: Define access control for profiles table
-- Created: From refactored supabase-schema.sql
-- Table: profiles
-- ============================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Policy 1: Public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
