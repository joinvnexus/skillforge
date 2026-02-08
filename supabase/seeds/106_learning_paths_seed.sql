-- ============================================
-- Seed Data: learning_paths
-- Purpose: Insert sample learning paths converted from JSON
-- Created: 2026-02-07
-- Table: learning_paths
-- ============================================

-- Note: Run this after migration 003_add_learning_paths_table.sql

INSERT INTO learning_paths (slug, level, title, description, icon, image, course_count, estimated_duration, features, skills, curriculum, is_published, is_featured, display_order) VALUES
(
    'beginner',
    'beginner',
    'Beginner Vue.js Path',
    'Start your Vue.js journey with these foundational concepts',
    '/images/paths/beginner.png',
    '/images/paths/beginner-hero.jpg',
    5,
    '4 weeks',
    ARRAY['Vue.js fundamentals', 'Component basics', 'Directives and data binding', 'Simple state management'],
    ARRAY['HTML', 'CSS', 'JavaScript', 'Vue Basics'],
    '[
        {
            "module": 1,
            "title": "Getting Started with Vue",
            "lessons": [
                {"title": "Introduction to Vue", "duration": "30 min"},
                {"title": "Creating Your First App", "duration": "45 min"}
            ]
        },
        {
            "module": 2,
            "title": "Component Fundamentals",
            "lessons": [
                {"title": "Understanding Components", "duration": "30 min"},
                {"title": "Props and Slots", "duration": "45 min"}
            ]
        }
    ]'::jsonb,
    true,
    true,
    1
),
(
    'intermediate',
    'intermediate',
    'Intermediate Vue.js Path',
    'Level up your Vue.js skills with advanced techniques',
    '/images/paths/intermediate.png',
    '/images/paths/intermediate-hero.jpg',
    8,
    '6 weeks',
    ARRAY['Composition API', 'Advanced components', 'Mixins', 'Vue Router'],
    ARRAY['Vue CLI', 'Vue Router', 'Vuex', 'Axios'],
    '[
        {
            "module": 1,
            "title": "Advanced Component Patterns",
            "lessons": [
                {"title": "Slots and Composition", "duration": "1 hour"},
                {"title": "Render Functions", "duration": "45 min"}
            ]
        }
    ]'::jsonb,
    true,
    true,
    2
),
(
    'advanced',
    'advanced',
    'Advanced Vue.js Mastery',
    'Master professional-grade Vue.js architecture and patterns',
    '/images/paths/advanced.png',
    '/images/paths/advanced-hero.jpg',
    6,
    '5 weeks',
    ARRAY['Performance optimization', 'SSR with Nuxt.js', 'Testing strategies', 'Plugin development'],
    ARRAY['Vue Router', 'Vuex', 'Nuxt.js', 'TypeScript'],
    '[
        {
            "module": 1,
            "title": "Performance Mastery",
            "lessons": [
                {"title": "Lazy Loading", "duration": "1 hour"},
                {"title": "Code Splitting", "duration": "45 min"}
            ]
        },
        {
            "module": 2,
            "title": "Server-Side Rendering",
            "lessons": [
                {"title": "Nuxt.js Fundamentals", "duration": "1.5 hours"},
                {"title": "SEO Optimization", "duration": "1 hour"}
            ]
        }
    ]'::jsonb,
    true,
    true,
    3
)
ON CONFLICT (slug) DO NOTHING;

-- Verify seed data
SELECT 'Learning paths seeded successfully' as status, COUNT(*) as count FROM learning_paths;
