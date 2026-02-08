-- ============================================
-- Migration: 105_add_instructors_table
-- Purpose: Create instructors table for instructor profiles
-- Created: 2026-02-07
-- Dependencies: 101_profiles_table (FK to profiles)
-- ============================================

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL UNIQUE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    expertise TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    website_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    github_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for instructors
CREATE INDEX IF NOT EXISTS idx_instructors_name ON instructors(name);
CREATE INDEX IF NOT EXISTS idx_instructors_featured ON instructors(is_featured, average_rating DESC) WHERE is_active = true AND is_featured = true;
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);
CREATE INDEX IF NOT EXISTS idx_instructors_expertise ON instructors USING GIN(expertise);

-- Enable Row Level Security
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Instructor RLS Policies (defined in separate file for separation of concerns)
-- See: supabase/policies/instructors_policies.sql
