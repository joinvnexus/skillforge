-- ============================================
-- Views: instructors and learning paths
-- Purpose: Create useful views for instructor and learning path queries
-- Created: 2026-02-07
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
