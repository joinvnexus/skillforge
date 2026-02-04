-- Supabase Database Schema for Skillshare-like Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    instructor_id UUID,
    category TEXT NOT NULL,
    description TEXT,
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

-- Enrollments table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    progress DECIMAL(5, 2) DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
    ('Web Development', 'Learn modern web development techniques'),
    ('Data Science', 'Master data analysis and machine learning'),
    ('Mobile Development', 'Build iOS and Android applications'),
    ('Design', 'Learn UI/UX and graphic design'),
    ('Business', 'Develop business and entrepreneurship skills'),
    ('Marketing', 'Master digital marketing strategies');

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert courses" ON courses
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'admin@example.com'
    ));

CREATE POLICY "Admins can update courses" ON courses
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'admin@example.com'
    ));

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_is_popular ON courses(is_popular);
CREATE INDEX idx_courses_is_featured ON courses(is_featured);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_reviews_course_id ON reviews(course_id);

-- Insert sample courses (you can modify or add more)
INSERT INTO courses (title, instructor, category, description, rating, price, students, duration, lessons, is_popular, is_featured, image, tags, level, language, certificate) VALUES
    ('Mastering Vue.js', 'John Doe', 'Web Development', 'Learn the essentials of Vue.js with hands-on projects.', 4.8, 180, 1250, '12 hours', 45, true, true, 'https://picsum.photos/id/28/367/267', ARRAY['Vue.js', 'JavaScript', 'Web Development', 'Frontend'], 'Beginner to Advanced', 'English', true),
    ('Advanced Vue Animations', 'Jane Smith', 'Web Development', 'Deep dive into Vue animations and transitions.', 4.7, 100, 890, '8 hours', 32, false, true, 'https://picsum.photos/200/300', ARRAY['Vue.js', 'Animations', 'Web Development', 'UI/UX'], 'Intermediate', 'English', true),
    ('Vue.js and Vuex Mastery', 'Emily White', 'Web Development', 'Master Vuex for state management in large-scale Vue.js applications.', 4.9, 200, 1500, '10 hours', 38, true, true, 'https://picsum.photos/200/300', ARRAY['Vue.js', 'Vuex', 'State Management', 'Advanced'], 'Advanced', 'English', true),
    ('Vue Router: From Basics to Advanced', 'Emma Wilson', 'Web Development', 'Learn how to navigate and structure your Vue.js apps with Vue Router.', 4.5, 125, 1100, '6 hours', 28, true, false, 'https://picsum.photos/536/354', ARRAY['Vue.js', 'Vue Router', 'Web Development', 'Routing'], 'Intermediate', 'English', true),
    ('Building Single Page Applications with Vue.js', 'Sophia Green', 'Web Development', 'Create powerful SPAs using the best practices in Vue.js.', 4.8, 175, 950, '14 hours', 42, false, true, 'https://picsum.photos/id/28/367/267', ARRAY['Vue.js', 'SPA', 'Web Development', 'Frontend'], 'Advanced', 'English', true);

-- Function to trigger email confirmation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public) VALUES ('course-images', 'course-images', true);

-- Storage policies
CREATE POLICY "Course images are publicly readable" ON storage.objects
    FOR SELECT USING (bucket_id = 'course-images');

CREATE POLICY "Authenticated users can upload course images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'course-images' AND auth.role() = 'authenticated');
