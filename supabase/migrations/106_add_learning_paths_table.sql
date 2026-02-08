-- ============================================
-- Migration: 106_add_learning_paths_table
-- Purpose: Create learning_paths table for structured learning journeys
-- Created: 2026-02-07
-- Dependencies: 102_courses_and_categories (FK to courses)
-- ============================================

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    image TEXT,
    course_count INTEGER DEFAULT 0,
    estimated_duration TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    curriculum JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    testimonials JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for learning_paths
CREATE INDEX IF NOT EXISTS idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX IF NOT EXISTS idx_learning_paths_level ON learning_paths(level);
CREATE INDEX IF NOT EXISTS idx_learning_paths_published ON learning_paths(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_learning_paths_featured ON learning_paths(is_featured, display_order) WHERE is_published = true;

-- Enable Row Level Security
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Learning Paths RLS Policies (defined in separate file for separation of concerns)
-- See: supabase/policies/learning_paths_policies.sql

-- Create junction table for learning_paths <-> courses many-to-many relationship
CREATE TABLE IF NOT EXISTS learning_path_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_order INTEGER DEFAULT 0,
    lesson_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(learning_path_id, course_id)
);

-- Create indexes for junction table
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_path ON learning_path_courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_courses_course ON learning_path_courses(course_id);

-- Enable RLS on junction table
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;

-- Junction table RLS: Public read, Admin write
CREATE POLICY "Learning path courses are viewable by everyone" ON learning_path_courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage learning path courses" ON learning_path_courses
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin%')
    );
