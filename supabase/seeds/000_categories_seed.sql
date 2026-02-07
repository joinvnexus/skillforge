-- ============================================
-- Seed Data: categories
-- Purpose: Insert sample categories
-- Created: From refactored supabase-schema.sql
-- Table: categories
-- ============================================

INSERT INTO categories (name, description, image) VALUES
    ('Web Development', 'Learn modern web development techniques', 'https://picsum.photos/id/60/400/300'),
    ('Data Science', 'Master data analysis and machine learning', 'https://picsum.photos/id/1/400/300'),
    ('Mobile Development', 'Build iOS and Android applications', 'https://picsum.photos/id/30/400/300'),
    ('Design', 'Learn UI/UX and graphic design', 'https://picsum.photos/id/39/400/300'),
    ('Business', 'Develop business and entrepreneurship skills', 'https://picsum.photos/id/1074/400/300'),
    ('Marketing', 'Master digital marketing strategies', 'https://picsum.photos/id/146/400/300')
ON CONFLICT (name) DO NOTHING;

SELECT 'Categories seeded' as status, COUNT(*) as count FROM categories;
