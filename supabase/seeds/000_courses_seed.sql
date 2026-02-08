-- ============================================
-- Seed Data: courses (JSON-এর সাথে মিলিয়ে সংশোধিত)
-- ============================================

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
    'Web Development', -- JSON-এও একই
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
-- Course 2: Advanced Vue Animations (Category JSON-এর মতো)
(
    'Advanced Vue Animations',
    'Jane Smith',
    'Data Science', -- JSON-এর সাথে মিলিয়ে
    'Deep dive into Vue animations and transitions.',
    'Explore advanced animation techniques, including dynamic transitions, animation hooks, and scroll-triggered animations.',
    'In Advanced Vue Animations, you will explore cutting-edge animation techniques using Vue.js. Learn how to build immersive user interfaces with dynamic transitions, animation hooks, and scroll-based animations. This course is perfect for developers who want to enhance the interactivity and user experience of their Vue applications.',
    4.7, 10, 890, '8 hours', 32,
    'https://picsum.photos/200/300', -- JSON-এর মতো
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
-- Course 3: Vue.js and Vuex Mastery (Category JSON-এর মতো)
(
    'Vue.js and Vuex Mastery',
    'Emily White',
    'Mobile Development', -- JSON-এর সাথে মিলিয়ে
    'Master Vuex for state management in large-scale Vue.js applications.',
    'Learn how to manage complex state in your Vue applications, build robust architectures, and create seamless user experiences.',
    'This Vue.js and Vuex Mastery course focuses on state management, a crucial aspect of building large-scale Vue.js applications. You''ll learn the intricacies of Vuex, how to design scalable state management architectures, and create applications that are easy to maintain and enhance over time.',
    4.9, 200, 1500, '10 hours', 38,
    'https://picsum.photos/200/300', -- JSON-এর মতো
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
-- Course 4: Vue Router: From Basics to Advanced (Category JSON-এর মতো)
(
    'Vue Router: From Basics to Advanced',
    'Emma Wilson',
    'Design', -- JSON-এর সাথে মিলিয়ে
    'Learn how to navigate and structure your Vue.js apps with Vue Router.',
    'Master client-side routing with Vue Router for seamless navigation experiences.',
    'This comprehensive course covers everything from basic routing concepts to advanced navigation guards and lazy loading routes. You''ll learn how to structure large applications effectively with nested and dynamic routes.',
    4.5, 125, 1100, '6 hours', 28,
    'https://picsum.photos/536/354', -- JSON-এর মতো
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
-- (এইটি ঠিক আছে, শুধু category JSON-এর মতো করতে হবে)
(
    'Building Single Page Applications with Vue.js',
    'Sophia Green',
    'Business', -- JSON-এর মতো
    'Create powerful SPAs using the best practices in Vue.js.',
    'Learn to build modern single-page applications with Vue.js from scratch.',
    'This course takes you through the complete process of building a production-ready SPA with Vue.js. You''ll learn about project structure, component architecture, state management, authentication, and deployment strategies.',
    4.8, 175, 950, '14 hours', 42,
    'https://picsum.photos/id/28/367/267',
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
-- Course 6: Vue.js and REST APIs (Category JSON-এর মতো)
(
    'Vue.js and REST APIs',
    'Chris Lee',
    'Marketing', -- JSON-এর মতো
    'Learn how to integrate Vue.js with RESTful APIs to build dynamic apps.',
    'Connect your Vue.js applications to backend services with REST APIs.',
    'This practical course teaches you how to fetch, display, and manipulate data from REST APIs in your Vue.js applications. You''ll learn about axios, error handling, loading states, and best practices for API integration.',
    4.3, 120, 800, '7 hours', 25,
    'https://picsum.photos/536/354', -- JSON-এর মতো
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
-- (এইটি ঠিক আছে)
(
    'Creating Reusable Components in Vue.js',
    'Olivia White',
    'Web Development',
    'Build and organize reusable components for efficient development.',
    'Master component composition and reusability patterns in Vue.js.',
    'Learn how to design and build truly reusable Vue components that can be shared across projects. This course covers slots, props validation, component communication patterns, and building component libraries.',
    4.6, 140, 1350, '5 hours', 20,
    'https://picsum.photos/536/354', -- JSON-এর মতো
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
-- Course 8: Vue.js Performance Optimization (Category JSON-এর মতো)
-- এবং duration issue fix
(
    'Vue.js Performance Optimization',
    'Liam Brown',
    'Data Science', -- JSON-এর মতো
    'Optimize your Vue.js applications for better performance and user experience.',
    'Learn techniques to improve the performance of your Vue.js applications.',
    'This course focuses on performance optimization techniques for Vue.js applications. You''ll learn about lazy loading, code splitting, caching strategies, and best practices for building high-performance Vue apps.',
    4.7, 160, 1200, '9 hours', 30,
    'https://picsum.photos/536/354', -- JSON-এর মতো
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
-- Course 9: Vue.js Testing with Jest (Category JSON-এর মতো)
(
    'Vue.js Testing with Jest',
    'Ava Johnson',
    'Mobile Development', -- JSON-এর মতো
    'Learn how to test your Vue.js applications using Jest.',
    'Master testing techniques for Vue.js applications using Jest.',
    'This course covers the fundamentals of testing Vue.js applications using Jest. You''ll learn about unit testing, snapshot testing, and end-to-end testing with Cypress.',
    4.4, 130, 700, '6 hours', 22,
    'https://picsum.photos/536/354', -- JSON-এর মতো
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

SELECT 'Courses seeded (JSON-এর সাথে aligned)' as status, COUNT(*) as count FROM courses;