-- ============================================
-- Migration: 101_profiles_table
-- Purpose: Create user profiles table
-- Created: From refactored supabase-schema.sql
-- Dependencies: 000_initial_setup (UUID extension)
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies (see policies/profiles_policies.sql)
