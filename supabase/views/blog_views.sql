-- ============================================
-- Views: blogs
-- Purpose: Create useful views for blog queries
-- Created: 2026-02-07
-- ============================================

-- View: Published blogs for public display
CREATE OR REPLACE VIEW published_blogs AS
SELECT 
    id,
    title,
    slug,
    snippet,
    content,
    image,
    author,
    published_at,
    tags,
    reading_time_minutes,
    view_count,
    created_at
FROM blogs
WHERE is_published = true
ORDER BY published_at DESC;

-- View: Featured blogs for homepage
CREATE OR REPLACE VIEW featured_blogs AS
SELECT 
    id,
    title,
    slug,
    snippet,
    image,
    author,
    published_at,
    tags
FROM blogs
WHERE is_published = true AND is_featured = true
ORDER BY published_at DESC;

-- View: Blog statistics
CREATE OR REPLACE VIEW blog_statistics AS
SELECT 
    COUNT(*) as total_blogs,
    COUNT(*) FILTER (WHERE is_published = true) as published_blogs,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_blogs,
    SUM(view_count) as total_views,
    AVG(view_count)::INTEGER as avg_views
FROM blogs;

-- View: Blog with author details (if author_id is linked)
CREATE OR REPLACE VIEW blogs_with_authors AS
SELECT 
    b.*,
    p.full_name as author_name,
    p.avatar_url as author_avatar,
    p.bio as author_bio
FROM blogs b
LEFT JOIN profiles p ON b.author_id = p.id
WHERE b.is_published = dtrue;
