-- ============================================
-- Functions and Triggers: blogs
-- Purpose: Helper functions and triggers for blogs table
-- Created: 2026-02-07
-- ============================================

-- Function: Update blog timestamp
CREATE OR REPLACE FUNCTION update_blog_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on blog update
DROP TRIGGER IF EXISTS update_blogs_timestamp ON blogs;
CREATE TRIGGER update_blogs_timestamp
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE PROCEDURE update_blog_timestamp();

-- Function: Increment blog view count
CREATE OR REPLACE FUNCTION increment_blog_view_count(blog_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE blogs 
    SET view_count = view_count + 1 
    WHERE id = blog_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Get next slug if title already exists
CREATE OR REPLACE FUNCTION get_unique_slug(input_title TEXT, exclude_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    counter INTEGER := 1;
    final_slug TEXT;
BEGIN
    base_slug := generate_slug_from_title(input_title);
    final_slug := base_slug;
    
    WHILE EXISTS (
        SELECT 1 FROM blogs 
        WHERE slug = final_slug 
        AND (exclude_id IS NULL OR id != exclude_id)
    ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
