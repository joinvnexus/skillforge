-- ============================================
-- Migration: 104_indexes
-- Purpose: Create all performance indexes
-- Created: From refactored supabase-schema.sql
-- Dependencies: 101-103 (tables must exist)
-- ============================================

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_popular ON courses(is_popular);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- Categories index
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Additional course indexes for filtering
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_price ON courses(price);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_courses_popular_featured ON courses(is_popular, is_featured, rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category_rating ON courses(category, rating DESC);
