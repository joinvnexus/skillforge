-- ============================================
-- Migration: 105_functions_triggers
-- Purpose: Create helper functions and triggers
-- Created: From refactored supabase-schema.sql
-- Dependencies: 101-103 (tables must exist)
-- ============================================

-- ============================================
-- Profile Functions
-- ============================================

-- Function: Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function: Update profile timestamp
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_profile_timestamp();

-- ============================================
-- Course Functions
-- ============================================

-- Function: Update course rating when new review is added
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews 
        WHERE course_id = NEW.course_id
    )
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating course ratings
DROP TRIGGER IF EXISTS update_course_rating_trigger ON reviews;
CREATE TRIGGER update_course_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating();

-- Function: Update student count
CREATE OR REPLACE FUNCTION update_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE courses 
        SET students = students + 1
        WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE courses 
        SET students = students - 1
        WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating student count
DROP TRIGGER IF EXISTS update_student_count_trigger ON enrollments;
CREATE TRIGGER update_student_count_trigger
AFTER INSERT OR DELETE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_student_count();
