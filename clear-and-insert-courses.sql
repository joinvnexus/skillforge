-- Run this in Supabase SQL Editor to clear and re-insert courses

-- Step 1: Delete all existing courses
DELETE FROM courses;

-- Step 2: Insert 9 sample courses
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
    'Mastering Vue.js is the ultimate course to learn the essentials of Vue.js, starting from the basics to more advanced concepts like state management with Vuex, routing with Vue Router, and building real-world applications.',
    4.8, 180, 1250, '12 hours', 45,
    'https://picsum.photos/id/28/367/267',
    ARRAY['Vue.js', 'JavaScript', 'Web Development', 'Frontend'],
    'Beginner to Advanced', true, true, '2023-01-15',
    'English', true,
    ARRAY['Master Vue.js fundamentals', 'Build real-world applications', 'Learn state management with Vuex'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 2: Advanced Vue Animations
(
    'Advanced Vue Animations',
    'Jane Smith',
    'Web Development',
    'Deep dive into Vue animations and transitions.',
    'Explore advanced animation techniques, including dynamic transitions, animation hooks, and scroll-triggered animations.',
    'In Advanced Vue Animations, you will explore cutting-edge animation techniques using Vue.js.',
    4.7, 10, 890, '8 hours', 32,
    'https://picsum.photos/id/43/367/267',
    ARRAY['Vue.js', 'Animations', 'Web Development', 'UI/UX'],
    'Intermediate', false, true, '2023-03-22',
    'English', true,
    ARRAY['Dynamic transitions', 'Animation hooks', 'Scroll-triggered animations'],
    ARRAY['Basic knowledge of Vue.js'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 3: Vue.js and Vuex Mastery
(
    'Vue.js and Vuex Mastery',
    'Emily White',
    'Web Development',
    'Master Vuex for state management in large-scale Vue.js applications.',
    'Learn how to manage complex state in your Vue applications.',
    'This Vue.js and Vuex Mastery course focuses on state management.',
    4.9, 200, 1500, '10 hours', 38,
    'https://picsum.photos/id/27/367/267',
    ARRAY['Vue.js', 'Vuex', 'State Management', 'Advanced'],
    'Advanced', true, true, '2023-02-10',
    'English', true,
    ARRAY['Deep dive into Vuex', 'State management patterns', 'Building scalable applications'],
    ARRAY['Basic knowledge of Vue.js'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 4: Vue Router: From Basics to Advanced
(
    'Vue Router: From Basics to Advanced',
    'Emma Wilson',
    'Web Development',
    'Learn how to navigate and structure your Vue.js apps with Vue Router.',
    'Master client-side routing with Vue Router for seamless navigation experiences.',
    'This comprehensive course covers everything from basic routing concepts to advanced navigation guards.',
    4.5, 125, 1100, '6 hours', 28,
    'https://picsum.photos/id/35/367/267',
    ARRAY['Vue.js', 'Vue Router', 'Web Development', 'Routing'],
    'Intermediate', true, false, '2023-04-05',
    'English', true,
    ARRAY['Client-side routing', 'Dynamic route matching', 'Navigation guards'],
    ARRAY['Basic knowledge of Vue.js'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 5: Building Single Page Applications with Vue.js
(
    'Building Single Page Applications with Vue.js',
    'Sophia Green',
    'Data Science',
    'Create powerful SPAs using the best practices in Vue.js.',
    'Learn to build modern single-page applications with Vue.js from scratch.',
    'This course takes you through the complete process of building a production-ready SPA.',
    4.8, 175, 950, '14 hours', 42,
    'https://picsum.photos/id/29/367/267',
    ARRAY['Vue.js', 'SPA', 'Web Development', 'Frontend'],
    'Advanced', false, true, '2023-05-18',
    'English', true,
    ARRAY['Hands-on projects', 'Real-world examples', 'Lifetime access'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb,
    'Sophia is a seasoned web developer with a passion for building dynamic user interfaces.',
    'https://picsum.photos/id/64/200/200',
    4.8, 3256, 8
),
-- Course 6: Vue.js and REST APIs
(
    'Vue.js and REST APIs',
    'Chris Lee',
    'Mobile Development',
    'Learn how to integrate Vue.js with RESTful APIs to build dynamic apps.',
    'Connect your Vue.js applications to backend services with REST APIs.',
    'This practical course teaches you how to fetch, display, and manipulate data from REST APIs.',
    4.3, 120, 800, '7 hours', 25,
    'https://picsum.photos/id/36/367/267',
    ARRAY['Vue.js', 'REST API', 'Backend Integration', 'JavaScript'],
    'Intermediate', false, false, '2023-01-30',
    'English', true,
    ARRAY['Hands-on projects', 'Real-world examples', 'Lifetime access'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 7: Creating Reusable Components in Vue.js
(
    'Creating Reusable Components in Vue.js',
    'Olivia White',
    'Design',
    'Build and organize reusable components for efficient development.',
    'Master component composition and reusability patterns in Vue.js.',
    'Learn how to design and build truly reusable Vue components.',
    4.6, 140, 1350, '5 hours', 20,
    'https://picsum.photos/id/37/367/267',
    ARRAY['Vue.js', 'JavaScript', 'Web Development', 'Frontend'],
    'Beginner to Intermediate', true, false, '2023-06-12',
    'English', true,
    ARRAY['Hands-on projects', 'Real-world examples', 'Lifetime access'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 8: Vue.js Performance Optimization
(
    'Vue.js Performance Optimization',
    'Liam Brown',
    'Business',
    'Optimize your Vue.js applications for better performance and user experience.',
    'Learn techniques to improve the performance of your Vue.js applications.',
    'This course focuses on performance optimization techniques for Vue.js applications.',
    4.7, 160, 1200, '9 hours', 30,
    'https://picsum.photos/id/38/367/267',
    ARRAY['Vue.js', 'Performance', 'Web Development', 'Optimization'],
    'Intermediate to Advanced', true, false, '2023-07-20',
    'English', true,
    ARRAY['Hands-on projects', 'Real-world examples', 'Lifetime access'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
),
-- Course 9: Vue.js Testing with Jest
(
    'Vue.js Testing with Jest',
    'Ava Johnson',
    'Marketing',
    'Learn how to test your Vue.js applications using Jest.',
    'Master testing techniques for Vue.js applications using Jest.',
    'This course covers the fundamentals of testing Vue.js applications using Jest.',
    4.4, 130, 700, '6 hours', 22,
    'https://picsum.photos/id/40/367/267',
    ARRAY['Vue.js', 'Testing', 'JavaScript', 'Jest'],
    'Intermediate', false, false, '2023-08-15',
    'English', true,
    ARRAY['Hands-on projects', 'Real-world examples', 'Lifetime access'],
    ARRAY['Basic knowledge of HTML, CSS, and JavaScript'],
    '[]'::jsonb, '[]'::jsonb, NULL, NULL, 0, 0, 0
);

-- Verify the count
SELECT COUNT(*) as total_courses FROM courses;
