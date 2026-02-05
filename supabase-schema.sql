-- ============================================
-- E-Learning Platform Database Schema - Complete SQL
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Drop existing tables if you want fresh start (Optional)
-- Remove the comment (--) if you want to drop existing tables
-- DROP TABLE IF EXISTS course_progress CASCADE;
-- DROP TABLE IF EXISTS wishlist CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS enrollments CASCADE;
-- DROP TABLE IF EXISTS courses CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Step 3: Create tables with IF NOT EXISTS
-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    instructor_id UUID REFERENCES profiles(id),
    category TEXT NOT NULL,
    description TEXT,
    description_extended TEXT,
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

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    progress DECIMAL(5, 2) DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, course_id)
);

-- Course progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    section_index INTEGER,
    lesson_index INTEGER,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Step 4: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Drop existing policies first
DO $$ 
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    -- Courses policies
    DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
    DROP POLICY IF EXISTS "Admins can insert courses" ON courses;
    DROP POLICY IF EXISTS "Admins can update courses" ON courses;
    
    -- Categories policies
    DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
    
    -- Enrollments policies
    DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
    DROP POLICY IF EXISTS "Users can create their own enrollments" ON enrollments;
    
    -- Reviews policies
    DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
    DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
    
    -- Wishlist policies
    DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlist;
    DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist;
END $$;

-- Create new policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Courses
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert courses" ON courses
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE email LIKE '%@admin%'
    ));
CREATE POLICY "Admins can update courses" ON courses
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email LIKE '%@admin%'
    ));

-- Categories
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- Enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wishlist" ON wishlist
    FOR ALL USING (auth.uid() = user_id);

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_popular ON courses(is_popular);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Step 7: Insert sample categories
INSERT INTO categories (name, description, image) VALUES
    ('Web Development', 'Learn modern web development techniques', 'https://picsum.photos/id/60/400/300'),
    ('Data Science', 'Master data analysis and machine learning', 'https://picsum.photos/id/1/400/300'),
    ('Mobile Development', 'Build iOS and Android applications', 'https://picsum.photos/id/30/400/300'),
    ('Design', 'Learn UI/UX and graphic design', 'https://picsum.photos/id/39/400/300'),
    ('Business', 'Develop business and entrepreneurship skills', 'https://picsum.photos/id/1074/400/300'),
    ('Marketing', 'Master digital marketing strategies', 'https://picsum.photos/id/146/400/300')
ON CONFLICT (name) DO NOTHING;

-- Step 8: Insert sample courses (9 courses from your data)
INSERT INTO courses (
    title, instructor, category, description, description_extended, full_description,
    rating, price, students, duration, lessons, image, tags, level, is_popular,
    is_featured, created_at, language, certificate, features, prerequisites,
    sections, instructor_other_courses, instructor_bio, instructor_image,
    instructor_rating, instructor_reviews, instructor_courses_count
) VALUES
-- Course 1: Mastering Vue.js
(
    'Mastering Vue.js',
    'John Doe',
    'Web Development',
    'Learn the essentials of Vue.js with hands-on projects.',
    'This course covers everything from basics to advanced concepts, including state management, Vue Router, and more.',
    'Mastering Vue.js is the ultimate course to learn the essentials of Vue.js, starting from the basics to more advanced concepts like state management with Vuex, routing with Vue Router, and building real-world applications. Dive into practical projects and hands-on exercises to solidify your understanding.',
    4.8, 180, 1250, '12 hours', 45,
    'https://picsum.photos/id/28/367/267',
    ARRAY['Vue.js', 'JavaScript', 'Web Development', 'Frontend'],
    'Beginner to Advanced', true, true, '2023-01-15',
    'English', true,
    ARRAY[
        'Master Vue.js fundamentals',
        'Build real-world applications',
        'Learn state management with Vuex',
        'Implement routing with Vue Router',
        'Create reusable components',
        'Understand best practices'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'No prior experience with Vue.js required'
    ],
    '[{"title": "Introduction to Vue.js", "duration": "2 hours", "lessons": [{"title": "Getting Started with Vue.js", "duration": "30 min", "type": "video"}, {"title": "Vue.js Basics", "duration": "1 hour", "type": "video"}]}, {"title": "State Management with Vuex", "duration": "3 hours", "lessons": [{"title": "Understanding Vuex", "duration": "1 hour", "type": "video"}, {"title": "Implementing Vuex in Your App", "duration": "2 hours", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Advanced Vue.js Patterns", "duration": "8 hours", "lessons": 20, "description": "Explore advanced patterns and techniques in Vue.js development."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 2: Advanced Vue Animations
(
    'Advanced Vue Animations',
    'Jane Smith',
    'Web Development',
    'Deep dive into Vue animations and transitions.',
    'Explore advanced animation techniques, including dynamic transitions, animation hooks, and scroll-triggered animations.',
    'In Advanced Vue Animations, you will explore cutting-edge animation techniques using Vue.js. Learn how to build immersive user interfaces with dynamic transitions, animation hooks, and scroll-based animations. This course is perfect for developers who want to enhance the interactivity and user experience of their Vue applications.',
    4.7, 10, 890, '8 hours', 32,
    'https://picsum.photos/id/43/367/267',
    ARRAY['Vue.js', 'Animations', 'Web Development', 'UI/UX'],
    'Intermediate', false, true, '2023-03-22',
    'English', true,
    ARRAY[
        'Dynamic transitions',
        'Animation hooks',
        'Scroll-triggered animations',
        'Performance optimization',
        'Real-world examples',
        'Hands-on projects'
    ],
    ARRAY[
        'Basic knowledge of Vue.js',
        'Familiarity with CSS animations'
    ],
    '[{"title": "Introduction to Vue Animations", "duration": "1 hour", "lessons": [{"title": "Understanding Vue Animation Basics", "duration": "30 min", "type": "video"}, {"title": "Setting Up the Environment", "duration": "30 min", "type": "video"}]}, {"title": "Dynamic Transitions", "duration": "2 hours", "lessons": [{"title": "Creating Dynamic Transitions", "duration": "1 hour", "type": "video"}, {"title": "Using Transition Groups", "duration": "1 hour", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 3: Vue.js and Vuex Mastery
(
    'Vue.js and Vuex Mastery',
    'Emily White',
    'Web Development',
    'Master Vuex for state management in large-scale Vue.js applications.',
    'Learn how to manage complex state in your Vue applications, build robust architectures, and create seamless user experiences.',
    'This Vue.js and Vuex Mastery course focuses on state management, a crucial aspect of building large-scale Vue.js applications. You''ll learn the intricacies of Vuex, how to design scalable state management architectures, and create applications that are easy to maintain and enhance over time.',
    4.9, 200, 1500, '10 hours', 38,
    'https://picsum.photos/id/27/367/267',
    ARRAY['Vue.js', 'Vuex', 'State Management', 'Advanced'],
    'Advanced', true, true, '2023-02-10',
    'English', true,
    ARRAY[
        'Deep dive into Vuex',
        'State management patterns',
        'Building scalable applications',
        'Real-world projects',
        'Hands-on exercises',
        'Community support'
    ],
    ARRAY[
        'Basic knowledge of Vue.js',
        'Familiarity with JavaScript ES6+'
    ],
    '[{"title": "Understanding Vuex", "duration": "2 hours", "lessons": [{"title": "Vuex Fundamentals", "duration": "1 hour", "type": "video"}, {"title": "State Management Patterns", "duration": "1 hour", "type": "video"}]}, {"title": "Building Scalable Applications", "duration": "3 hours", "lessons": [{"title": "Designing Vuex Modules", "duration": "1.5 hours", "type": "video"}, {"title": "Integrating Vuex with Vue Router", "duration": "1.5 hours", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 4: Vue Router: From Basics to Advanced
(
    'Vue Router: From Basics to Advanced',
    'Emma Wilson',
    'Web Development',
    'Learn how to navigate and structure your Vue.js apps with Vue Router.',
    'Master client-side routing with Vue Router for seamless navigation experiences.',
    'This comprehensive course covers everything from basic routing concepts to advanced navigation guards and lazy loading routes. You''ll learn how to structure large applications effectively with nested and dynamic routes.',
    4.5, 125, 1100, '6 hours', 28,
    'https://picsum.photos/id/35/367/267',
    ARRAY['Vue.js', 'Vue Router', 'Web Development', 'Routing'],
    'Intermediate', true, false, '2023-04-05',
    'English', true,
    ARRAY[
        'Client-side routing',
        'Dynamic route matching',
        'Navigation guards',
        'Lazy loading routes',
        'Nested routes',
        'Real-world examples'
    ],
    ARRAY[
        'Basic knowledge of Vue.js',
        'Familiarity with JavaScript ES6+'
    ],
    '[{"title": "Introduction to Vue Router", "duration": "1 hour", "lessons": [{"title": "Getting Started with Vue Router", "duration": "30 min", "type": "video"}, {"title": "Basic Routing Concepts", "duration": "30 min", "type": "video"}]}, {"title": "Advanced Routing Techniques", "duration": "2 hours", "lessons": [{"title": "Dynamic Route Matching", "duration": "1 hour", "type": "video"}, {"title": "Navigation Guards", "duration": "1 hour", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 5: Building Single Page Applications with Vue.js
(
    'Building Single Page Applications with Vue.js',
    'Sophia Green',
    'Web Development',
    'Create powerful SPAs using the best practices in Vue.js.',
    'Learn to build modern single-page applications with Vue.js from scratch.',
    'This course takes you through the complete process of building a production-ready SPA with Vue.js. You''ll learn about project structure, component architecture, state management, authentication, and deployment strategies.',
    4.8, 175, 950, '14 hours', 42,
    'https://picsum.photos/id/29/367/267',
    ARRAY['Vue.js', 'SPA', 'Web Development', 'Frontend'],
    'Advanced', false, true, '2023-05-18',
    'English', true,
    ARRAY[
        'Hands-on projects',
        'Real-world examples',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile-friendly'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with Vue.js fundamentals'
    ],
    '[{"title": "Introduction to SPAs", "duration": "1 hour", "lessons": [{"title": "What is a SPA?", "duration": "20 min", "type": "video"}, {"title": "Benefits of SPAs", "duration": "15 min", "type": "video"}]}, {"title": "Setting Up the Project", "duration": "2 hours", "lessons": [{"title": "Vue CLI Basics", "duration": "30 min", "type": "video"}, {"title": "Project Structure", "duration": "45 min", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "8 hours", "lessons": 30, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Advanced Vue.js Patterns", "duration": "10 hours", "lessons": 35, "description": "Explore advanced patterns and techniques in Vue.js development."}]',
    'Sophia is a seasoned web developer with a passion for building dynamic user interfaces.',
    'https://picsum.photos/id/64/200/200',
    4.8, 3256, 8
),
-- Course 6: Vue.js and REST APIs
(
    'Vue.js and REST APIs',
    'Chris Lee',
    'Web Development',
    'Learn how to integrate Vue.js with RESTful APIs to build dynamic apps.',
    'Connect your Vue.js applications to backend services with REST APIs.',
    'This practical course teaches you how to fetch, display, and manipulate data from REST APIs in your Vue.js applications. You''ll learn about axios, error handling, loading states, and best practices for API integration.',
    4.3, 120, 800, '7 hours', 25,
    'https://picsum.photos/id/36/367/267',
    ARRAY['Vue.js', 'REST API', 'Backend Integration', 'JavaScript'],
    'Intermediate', false, false, '2023-01-30',
    'English', true,
    ARRAY[
        'Hands-on projects',
        'Real-world examples',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile-friendly'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with Vue.js fundamentals'
    ],
    '[{"title": "Introduction to REST APIs", "duration": "1 hour", "lessons": [{"title": "What is a REST API?", "duration": "20 min", "type": "video"}, {"title": "Understanding HTTP Methods", "duration": "40 min", "type": "video"}]}, {"title": "Integrating Vue.js with REST APIs", "duration": "3 hours", "lessons": [{"title": "Using Axios for API Requests", "duration": "1 hour", "type": "video"}, {"title": "Handling API Responses", "duration": "1 hour", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 7: Creating Reusable Components in Vue.js
(
    'Creating Reusable Components in Vue.js',
    'Olivia White',
    'Web Development',
    'Build and organize reusable components for efficient development.',
    'Master component composition and reusability patterns in Vue.js.',
    'Learn how to design and build truly reusable Vue components that can be shared across projects. This course covers slots, props validation, component communication patterns, and building component libraries.',
    4.6, 140, 1350, '5 hours', 20,
    'https://picsum.photos/id/37/367/267',
    ARRAY['Vue.js', 'JavaScript', 'Web Development', 'Frontend'],
    'Beginner to Intermediate', true, false, '2023-06-12',
    'English', true,
    ARRAY[
        'Hands-on projects',
        'Real-world examples',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile-friendly'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with Vue.js fundamentals'
    ],
    '[{"title": "Understanding Vue Components", "duration": "1 hour", "lessons": [{"title": "What are Vue Components?", "duration": "20 min", "type": "video"}, {"title": "Creating Your First Component", "duration": "40 min", "type": "video"}]}, {"title": "Building Reusable Components", "duration": "2 hours", "lessons": [{"title": "Component Communication", "duration": "1 hour", "type": "video"}, {"title": "Creating a Component Library", "duration": "1 hour", "type": "video"}]}, {"title": "Advanced Component Patterns", "duration": "2 hours", "lessons": [{"title": "Using Slots for Flexibility", "duration": "1 hour", "type": "video"}, {"title": "Props Validation and Defaults", "duration": "1 hour", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 8: Vue.js Performance Optimization
(
    'Vue.js Performance Optimization',
    'Liam Brown',
    'Web Development',
    'Optimize your Vue.js applications for better performance and user experience.',
    'Learn techniques to improve the performance of your Vue.js applications.',
    'This course focuses on performance optimization techniques for Vue.js applications. You''ll learn about lazy loading, code splitting, caching strategies, and best practices for building high-performance Vue apps.',
    4.7, 160, 1200, '9 hours', 30,
    'https://picsum.photos/id/38/367/267',
    ARRAY['Vue.js', 'Performance', 'Web Development', 'Optimization'],
    'Intermediate to Advanced', true, false, '2023-07-20',
    'English', true,
    ARRAY[
        'Hands-on projects',
        'Real-world examples',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile-friendly'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with Vue.js fundamentals'
    ],
    '[{"title": "Understanding Performance Bottlenecks", "duration": "1 hour", "lessons": [{"title": "Identifying Performance Issues", "duration": "30 min", "type": "video"}, {"title": "Using Chrome DevTools for Profiling", "duration": "30 min", "type": "video"}]}, {"title": "Optimizing Rendering Performance", "duration": "2 hours", "lessons": [{"title": "Virtual DOM and Reconciliation", "duration": "1 hour", "type": "video"}, {"title": "Optimizing Component Updates", "duration": "1 hour", "type": "video"}]}, {"title": "Code Splitting and Lazy Loading", "duration": "2 hours", "lessons": [{"title": "Implementing Code Splitting", "duration": "1 hour", "type": "video"}, {"title": "Lazy Loading Components", "duration": "1 hour", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Vue.js Performance Optimization", "duration": "8 hours", "lessons": 20, "description": "Learn how to optimize your Vue.js applications for better performance."}]',
    NULL, NULL, 0, 0, 0
),
-- Course 9: Vue.js Testing with Jest
(
    'Vue.js Testing with Jest',
    'Ava Johnson',
    'Web Development',
    'Learn how to test your Vue.js applications using Jest.',
    'Master testing techniques for Vue.js applications using Jest.',
    'This course covers the fundamentals of testing Vue.js applications using Jest. You''ll learn about unit testing, snapshot testing, and end-to-end testing with Cypress.',
    4.4, 130, 700, '6 hours', 22,
    'https://picsum.photos/id/40/367/267',
    ARRAY['Vue.js', 'Testing', 'JavaScript', 'Jest'],
    'Intermediate', false, false, '2023-08-15',
    'English', true,
    ARRAY[
        'Hands-on projects',
        'Real-world examples',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile-friendly'
    ],
    ARRAY[
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Familiarity with Vue.js fundamentals'
    ],
    '[{"title": "Introduction to Testing", "duration": "1 hour", "lessons": [{"title": "Unit Testing with Jest", "duration": "30 min", "type": "video"}, {"title": "Setting Up Testing Environment", "duration": "30 min", "type": "video"}]}]',
    '[{"title": "Vue.js for Beginners", "duration": "10 hours", "lessons": 25, "description": "A beginner-friendly course to get started with Vue.js."}, {"title": "Advanced Vue.js Testing", "duration": "8 hours", "lessons": 20, "description": "Learn advanced testing techniques for Vue.js."}]',
    NULL, NULL, 0, 0, 0
);

-- Step 9: Create functions and triggers
-- Function to handle new user signup
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

-- Create trigger for new user signup (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update profile timestamp
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

-- Function to update course rating when new review is added
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

-- Function to update student count
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

-- Step 10: Create useful views
-- View for popular courses
CREATE OR REPLACE VIEW popular_courses_view AS
SELECT * FROM courses 
WHERE is_popular = true 
ORDER BY rating DESC, students DESC;

-- View for featured courses
CREATE OR REPLACE VIEW featured_courses_view AS
SELECT * FROM courses 
WHERE is_featured = true 
ORDER BY created_at DESC;

-- View for new courses (last 30 days)
CREATE OR REPLACE VIEW new_courses_view AS
SELECT * FROM courses 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View for course statistics
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

-- Step 11: Test queries to verify everything works
-- Test 1: Check all tables
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'wishlist', COUNT(*) FROM wishlist
ORDER BY table_name;

-- Test 2: View sample courses
SELECT id, title, category, rating, price, students 
FROM courses 
ORDER BY rating DESC 
LIMIT 5;

-- Test 3: View categories
SELECT name, description 
FROM categories 
ORDER BY name;

-- Test 4: Check popular courses
SELECT title, rating, students, price 
FROM popular_courses_view 
LIMIT 5;

-- Test 5: Check featured courses
SELECT title, rating, students, price 
FROM featured_courses_view 
LIMIT 5;

-- Test 6: Create a sample enrollment (for testing - requires actual user_id)
-- Note: This is commented out, uncomment and replace with actual user_id
/*
INSERT INTO enrollments (user_id, course_id, progress) VALUES
(
    'your-user-uuid-here', -- Replace with actual user UUID
    (SELECT id FROM courses WHERE title = 'Mastering Vue.js' LIMIT 1),
    10
)
ON CONFLICT (user_id, course_id) DO NOTHING;
*/

-- Step 12: Final verification message
DO $$ 
BEGIN
    RAISE NOTICE '✅ Database setup completed successfully!';
    RAISE NOTICE '📊 Total courses inserted: %', (SELECT COUNT(*) FROM courses);
    RAISE NOTICE '📁 Total categories: %', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE '👤 Total profiles: %', (SELECT COUNT(*) FROM profiles);
END $$;

-- ============================================
-- Additional useful queries for your application
-- ============================================

/*
-- Query 1: Get all courses with category details
SELECT 
    c.*,
    cat.description as category_description,
    cat.image as category_image
FROM courses c
LEFT JOIN categories cat ON c.category = cat.name
ORDER BY c.created_at DESC;

-- Query 2: Search courses by keyword
SELECT * FROM courses 
WHERE 
    title ILIKE '%Vue%' OR
    description ILIKE '%Vue%' OR
    '%Vue%' = ANY(tags)
ORDER BY rating DESC;

-- Query 3: Get user's enrolled courses
SELECT 
    c.*,
    e.enrolled_at,
    e.progress
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.user_id = 'user-uuid-here'
ORDER BY e.enrolled_at DESC;

-- Query 4: Get course reviews with user info
SELECT 
    r.*,
    p.full_name as reviewer_name,
    p.avatar_url as reviewer_avatar
FROM reviews r
LEFT JOIN profiles p ON r.user_id = p.id
WHERE r.course_id = 'course-uuid-here'
ORDER BY r.created_at DESC;

-- Query 5: Get wishlist items for user
SELECT 
    c.*,
    w.added_at
FROM wishlist w
JOIN courses c ON w.course_id = c.id
WHERE w.user_id = 'user-uuid-here'
ORDER BY w.added_at DESC;
*/