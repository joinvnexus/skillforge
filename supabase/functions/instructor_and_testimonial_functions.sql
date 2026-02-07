-- ============================================
-- Functions and Triggers: instructors and testimonials
-- Purpose: Helper functions and triggers for instructors and testimonials
-- Created: 2026-02-07
-- ============================================

-- ============================================
-- INSTRUCTORS
-- ============================================

-- Function: Update instructor timestamp
CREATE OR REPLACE FUNCTION update_instructor_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on instructor update
DROP TRIGGER IF EXISTS update_instructors_timestamp ON instructors;
CREATE TRIGGER update_instructors_timestamp
    BEFORE UPDATE ON instructors
    FOR EACH ROW
    EXECUTE PROCEDURE update_instructor_timestamp();

-- Function: Calculate instructor average rating from courses
CREATE OR REPLACE FUNCTION calculate_instructor_rating(instructor_uuid UUID)
RETURNS DECIMAL(3, 2) AS $$
DECLARE
    avg_rating DECIMAL(3, 2);
BEGIN
    SELECT COALESCE(AVG(c.instructor_rating), 0)::DECIMAL(3, 2)
    INTO avg_rating
    FROM courses c
    WHERE c.instructor_id = instructor_uuid;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function: Update instructor statistics from their courses
CREATE OR REPLACE FUNCTION update_instructor_stats(instructor_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE instructors i
    SET 
        average_rating = calculate_instructor_rating(instructor_uuid),
        total_courses = (
            SELECT COUNT(*) FROM courses WHERE instructor_id = instructor_uuid
        ),
        total_students = COALESCE((
            SELECT SUM(students) FROM courses WHERE instructor_id = instructor_uuid
        ), 0),
        total_reviews = COALESCE((
            SELECT SUM(instructor_reviews) FROM courses WHERE instructor_id = instructor_uuid
        ), 0)
    WHERE id = instructor_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TESTIMONIALS
-- ============================================

-- Function: Update testimonial timestamp
CREATE OR REPLACE FUNCTION update_testimonial_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on testimonial update
DROP TRIGGER IF EXISTS update_testimonials_timestamp ON testimonials;
CREATE TRIGGER update_testimonials_timestamp
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE PROCEDURE update_testimonial_timestamp();

-- Function: Calculate average rating for a specific context
CREATE OR REPLACE FUNCTION get_context_average_rating(
    target_course_id UUID DEFAULT NULL,
    target_learning_path_id UUID DEFAULT NULL,
    target_instructor_id UUID DEFAULT NULL
) RETURNS DECIMAL(3, 2) AS $$
DECLARE
    avg_rating DECIMAL(3, 2);
BEGIN
    SELECT COALESCE(AVG(rating), 0)::DECIMAL(3, 2)
    INTO avg_rating
    FROM testimonials
    WHERE 
        (target_course_id IS NULL OR course_id = target_course_id)
        AND (target_learning_path_id IS NULL OR learning_path_id = target_learning_path_id)
        AND (target_instructor_id IS NULL OR instructor_id = target_instructor_id)
        AND is_approved = true;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;
