-- ============================================
-- Migration: 008_views
-- Purpose: Create all database views
-- Created: 2026-02-08
-- Dependencies: 002-007 (tables must exist)
-- ============================================

-- ============================================
-- Blog Views
-- ============================================

-- View: Published blogs for public display
CREATE OR REPLACE VIEW published_blogs AS
SELECT 
    id,
    title,
    slug,
    snippet,
    content,
    image,
    author,
    published_at,
    tags,
    reading_time_minutes,
    view_count,
    created_at
FROM blogs
WHERE is_published = true
ORDER BY published_at DESC;

-- View: Featured blogs for homepage
CREATE OR REPLACE VIEW featured_blogs AS
SELECT 
    id,
    title,
    slug,
    snippet,
    image,
    author,
    published_at,
    tags
FROM blogs
WHERE is_published = true AND is_featured = true
ORDER BY published_at DESC;

-- View: Blog statistics
CREATE OR REPLACE VIEW blog_statistics AS
SELECT 
    COUNT(*) as total_blogs,
    COUNT(*) FILTER (WHERE is_published = true) as published_blogs,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_blogs,
    SUM(view_count) as total_views,
    AVG(view_count)::INTEGER as avg_views
FROM blogs;

-- ============================================
-- Instructor Views
-- ============================================

-- View: Active featured instructors
CREATE OR REPLACE VIEW featured_instructors AS
SELECT 
    id,
    name,
    title,
    bio,
    photo,
    expertise,
    total_students,
    total_courses,
    average_rating
FROM instructors
WHERE is_active = true AND is_featured = true
ORDER BY average_rating DESC;

-- View: Instructors with user profile details
CREATE OR REPLACE VIEW instructors_with_profiles AS
SELECT 
    i.*,
    p.email,
    p.avatar_url as user_avatar
FROM instructors i
LEFT JOIN profiles p ON i.user_id = p.id
WHERE i.is_active = true;

-- ============================================
-- Learning Path Views
-- ============================================

-- View: Learning paths with course count
CREATE OR REPLACE VIEW learning_paths_with_courses AS
SELECT 
    lp.*,
    COUNT(lpc.course_id) as actual_course_count
FROM learning_paths lp
LEFT JOIN learning_path_courses lpc ON lp.id = lpc.learning_path_id
WHERE lp.is_published = true
GROUP BY lp.id
ORDER BY lp.display_order;

-- View: Learning paths with courses detail
CREATE OR REPLACE VIEW learning_paths_courses_detail AS
SELECT 
    lp.*,
    json_agg(
        json_build_object(
            'course_id', c.id,
            'course_title', c.title,
            'module_order', lpc.module_order,
            'lesson_order', lpc.lesson_order,
            'is_required', lpc.is_required
        ) ORDER BY lpc.module_order, lpc.lesson_order
    ) FILTER (WHERE lpc.course_id IS NOT NULL) as courses
FROM learning_paths lp
LEFT JOIN learning_path_courses lpc ON lp.id = lpc.learning_path_id
LEFT JOIN courses c ON lpc.course_id = c.id
WHERE lp.is_published = true
GROUP BY lp.id
ORDER BY lp.display_order;

-- ============================================
-- Testimonial Views
-- ============================================

-- View: Approved testimonials for public display
CREATE OR REPLACE VIEW approved_testimonials AS
SELECT 
    id,
    name,
    title,
    quote,
    photo,
    rating
FROM testimonials
WHERE is_approved = true
ORDER BY rating DESC, created_at DESC;

-- View: Featured testimonials for homepage
CREATE OR REPLACE VIEW featured_testimonials AS
SELECT 
    id,
    name,
    title,
    quote,
    photo,
    rating
FROM testimonials
WHERE is_approved = true AND is_featured = true
ORDER BY rating DESC
LIMIT 4;

-- View: Testimonials with course details
CREATE OR REPLACE VIEW testimonials_with_courses AS
SELECT 
    t.*,
    c.title as course_title
FROM testimonials t
LEFT JOIN courses c ON t.course_id = c.id
WHERE t.is_approved = true;

-- View: Testimonials with learning path details
CREATE OR REPLACE VIEW testimonials_with_learning_paths AS
SELECT 
    t.*,
    lp.title as learning_path_title
FROM testimonials t
LEFT JOIN learning_paths lp ON t.learning_path_id = lp.id
WHERE t.is_approved = true;

-- ============================================
-- Course Views
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
