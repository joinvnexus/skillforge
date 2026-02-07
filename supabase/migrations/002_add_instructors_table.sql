-- ============================================
-- Migration: 002_add_instructors_table
-- Purpose: Create instructors table for instructor profiles
-- Created: 2026-02-07
-- Dependencies: 001_add_blogs_table (uses profiles FK)
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
