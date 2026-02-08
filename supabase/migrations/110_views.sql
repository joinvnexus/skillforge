-- ============================================
-- Migration: 106_views
-- Purpose: Create useful database views
-- Created: From refactored supabase-schema.sql
-- Dependencies: 101-103 (tables must exist)
-- ============================================

-- View: Popular courses
CREATE OR REPLACE VIEW popular_courses AS
SELECT * FROM courses 
WHERE is_popular = true 
ORDER BY rating DESC, students DESC;

-- View: Featured courses
CREATE OR REPLACE VIEW featured_courses AS
SELECT * FROM courses 
WHERE is_featured = true 
ORDER BY created_at DESC;

-- View: New courses (last 30 days)
CREATE OR REPLACE VIEW new_courses AS
SELECT * FROM courses 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View: Course statistics
CREATE OR REPLACE VIEW course_statistics AS
SELECT 
    category,
    COUNT(*) as total_courses,
    AVG(rating) as avg_rating,
    SUM(students) as total_students,
    AVG(price) as avg_price
FROM courses 
GROUP BY category 
ORDER BY total_students DESC;

-- View: User enrolled courses with progress
CREATE OR REPLACE VIEW user_enrolled_courses AS
SELECT 
    c.*,
    e.enrolled_at,
    e.progress,
    e.completed_at
FROM enrollments e
JOIN courses c ON e.course_id = c.id
ORDER BY e.enrolled_at DESC;

-- View: Course reviews with user info
CREATE OR REPLACE VIEW course_reviews AS
SELECT 
    r.*,
    p.full_name as reviewer_name,
    p.avatar_url as reviewer_avatar
FROM reviews r
LEFT JOIN profiles p ON r.user_id = p.id
ORDER BY r.created_at DESC;

-- View: User wishlist with course details
CREATE OR REPLACE VIEW user_wishlist AS
SELECT 
    c.*,
    w.added_at
FROM wishlist w
JOIN courses c ON w.course_id = c.id
ORDER BY w.added_at DESC;

-- View: Courses by instructor
CREATE OR REPLACE VIEW courses_by_instructor AS
SELECT 
    instructor,
    COUNT(*) as course_count,
    AVG(rating) as avg_rating,
    SUM(students) as total_students
FROM courses
WHERE instructor IS NOT NULL
GROUP BY instructor
ORDER BY total_students DESC;
