-- ============================================
-- Migration: 102_courses_and_categories
-- Purpose: Create courses and categories tables
-- Created: From refactored supabase-schema.sql
-- Dependencies: 101_profiles_table (FK to profiles)
-- ============================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    instructor_id UUID REFERENCES profiles(id),
    category TEXT NOT NULL,
    description TEXT,
    description_extended TEXT,
    full_description TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0,
    students INTEGER DEFAULT 0,
    duration TEXT,
    lessons INTEGER DEFAULT 0,
    image TEXT,
    tags TEXT[],
    level TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    language TEXT DEFAULT 'English',
    certificate BOOLEAN DEFAULT false,
    features TEXT[],
    prerequisites TEXT[],
    sections JSONB,
    instructor_other_courses JSONB,
    instructor_bio TEXT,
    instructor_image TEXT,
    instructor_rating DECIMAL(3, 2) DEFAULT 0,
    instructor_reviews INTEGER DEFAULT 0,
    instructor_courses_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Courses/Categories RLS Policies (see policies/courses_policies.sql)
