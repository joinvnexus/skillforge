-- ============================================
-- Seed Data: testimonials
-- Purpose: Insert sample testimonials converted from JSON
-- Created: 2026-02-07
-- Table: testimonials
-- ============================================

-- Note: Run this after migration 004_add_testimonials_table.sql

INSERT INTO testimonials (name, title, quote, photo, rating, is_approved, is_featured) VALUES
(
    'Emily Johnson',
    'Front-End Developer',
    'This course completely changed the way I work with Vue.js! The instructors are phenomenal.',
    'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
    5,
    true,
    true
),
(
    'Michael Smith',
    'Full-Stack Engineer',
    'The structured learning paths made it easy to go from beginner to advanced. I recommend it to everyone!',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
    5,
    true,
    true
),
(
    'Sophia Brown',
    'UI/UX Designer',
    'This is hands down the best Vue.js learning platform! It has everything I needed to excel in my career.',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
    5,
    true,
    true
),
(
    'David Wilson',
    'Senior Developer',
    'The real-world projects helped me apply concepts immediately in my job. Worth every penny!',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80',
    4,
    true,
    true
)
ON CONFLICT DO NOTHING;

-- Verify seed data
SELECT 'Testimonials seeded successfully' as status, COUNT(*) as count FROM testimonials;
