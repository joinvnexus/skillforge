-- ============================================
-- Seed Data: instructors
-- Purpose: Insert sample instructors converted from JSON
-- Created: 2026-02-07
-- Updated: 2026-02-08 - Added display_order
-- Table: instructors
-- ============================================

-- Note: Run this after migration 002_add_instructors_table.sql
-- user_id is NULL: set these if you have existing user profiles

INSERT INTO instructors (name, title, bio, photo, social_links, expertise, is_active, is_featured, total_students, total_courses, average_rating, display_order) VALUES
(
    'John Doe',
    'Senior Vue.js Developer',
    'John is an experienced Vue.js developer with over 10 years in web development. He specializes in performance optimization and state management.',
    'https://salondesmaires-herault.fr/wp-content/uploads/2014/10/speaker-2-v2.jpg',
    '[
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/johndoe", "iconClass": "fab fa-linkedin"},
        {"platform": "Twitter", "url": "https://twitter.com/johndoe", "iconClass": "fab fa-twitter"},
        {"platform": "GitHub", "url": "https://github.com/johndoe", "iconClass": "fab fa-github"}
    ]'::jsonb,
    ARRAY['Vue.js', 'JavaScript', 'Performance', 'State Management'],
    true,
    true,
    5000,
    8,
    4.8,
    0
),
(
    'Jane Smith',
    'Full-Stack Developer & Mentor',
    'Jane specializes in full-stack web development and has taught thousands of students. She is passionate about clean code and best practices.',
    'https://captiontools.com/wp-content/uploads/2017/03/testy3-1.png',
    '[
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/janesmith", "iconClass": "fab fa-linkedin"},
        {"platform": "Twitter", "url": "https://twitter.com/janesmith", "iconClass": "fab fa-twitter"}
    ]'::jsonb,
    ARRAY['Vue.js', 'Node.js', 'MongoDB', 'Teaching'],
    true,
    true,
    8000,
    12,
    4.9,
    1
),
(
    'Alex Johnson',
    'UI/UX Specialist',
    'Alex combines development skills with design expertise to create beautiful, user-friendly interfaces with Vue.js.',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Tp9QV0YOLXrb3m0G6FyUlGcx5sBr8UNN7Ez6nj6u7qOi-LXNL2P0Gx9ynX80l-gXYFc&usqp=CAU',
    '[
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/alexjohnson", "iconClass": "fab fa-linkedin"},
        {"platform": "Dribbble", "url": "https://dribbble.com/alexjohnson", "iconClass": "fab fa-dribbble"}
    ]'::jsonb,
    ARRAY['Vue.js', 'UI/UX', 'CSS', 'Animation'],
    true,
    false,
    3500,
    5,
    4.7,
    2
),
(
    'Maria Garcia',
    'Nuxt.js Expert',
    'Maria is a Nuxt.js core contributor who helps developers build universal Vue applications with confidence.',
    'https://ticktickets.com.au/wp-content/uploads/2017/09/speaker6-min.jpg',
    '[
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/mariagarcia", "iconClass": "fab fa-linkedin"},
        {"platform": "GitHub", "url": "https://github.com/mariagarcia", "iconClass": "fab fa-github"}
    ]'::jsonb,
    ARRAY['Nuxt.js', 'Vue.js', 'SSR', 'TypeScript'],
    true,
    true,
    4200,
    6,
    4.9,
    3
)
ON CONFLICT DO NOTHING;

-- Verify seed data
SELECT 'Instructors seeded successfully' as status, COUNT(*) as count FROM instructors;
