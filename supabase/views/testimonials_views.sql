-- ============================================
-- Views: testimonials
-- Purpose: Create useful views for testimonial queries
-- Created: 2026-02-07
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
    c.title as course_title,
    c.slug as course_slug
FROM testimonials t
LEFT JOIN courses c ON t.course_id = c.id
WHERE t.is_approved = true;

-- View: Testimonials with learning path details
CREATE OR REPLACE VIEW testimonials_with_learning_paths AS
SELECT 
    t.*,
    lp.title as learning_path_title,
    lp.slug as learning_path_slug
FROM testimonials t
LEFT JOIN learning_paths lp ON t.learning_path_id = lp.id
WHERE t.is_approved = true;
