-- ============================================
-- Migration: 107_add_testimonials_table
-- Purpose: Create testimonials table for student testimonials
-- Created: 2026-02-07
-- Dependencies: 101_profiles_table, 102_courses_and_categories, 105_add_instructors_table, 106_add_learning_paths_table
-- ============================================

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    quote TEXT NOT NULL,
    photo TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    learning_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES instructors(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, rating DESC) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_course ON testimonials(course_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_learning_path ON testimonials(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_instructor ON testimonials(instructor_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_user ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved, created_at DESC);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Testimonial RLS Policies (defined in separate file for separation of concerns)
-- See: supabase/policies/testimonials_policies.sql
