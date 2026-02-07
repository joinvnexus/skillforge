# Supabase Migration Execution Plan

## Overview

This document provides the step-by-step execution plan for migrating your E-Learning platform's Supabase schema to a production-ready, migration-based structure.

## Current State

- **Existing Schema**: `supabase-schema.sql` ( monolithic file )
- **Existing Tables**: profiles, courses, categories, enrollments, reviews, wishlist, course_progress
- **Tables to Add**: blogs, instructors, learning_paths, testimonials, learning_path_courses

## Recommended Folder Structure

```
supabase/
├── migrations/                    # Schema migrations (append-only)
│   ├── 000_initial_setup.sql       # UUID extension
│   ├── 101_profiles_table.sql      # Existing: profiles
│   ├── 102_courses_and_categories.sql  # Existing: courses, categories
│   ├── 103_enrollments_reviews_wishlist.sql  # Existing: enrollments, reviews, wishlist, progress
│   ├── 104_indexes.sql             # All indexes
│   ├── 105_functions_triggers.sql  # Helper functions & triggers
│   ├── 106_views.sql               # Database views
│   ├── 001_add_blogs_table.sql     # NEW: blogs
│   ├── 002_add_instructors_table.sql  # NEW: instructors
│   ├── 003_add_learning_paths_table.sql  # NEW: learning_paths + junction
│   └── 004_add_testimonials_table.sql  # NEW: testimonials
├── policies/                       # RLS policies
│   ├── profiles_policies.sql       # Existing: profiles
│   ├── courses_policies.sql        # Existing: courses, categories
│   ├── enrollments_policies.sql    # Existing: enrollments
│   ├── reviews_policies.sql        # Existing: reviews
│   ├── wishlist_policies.sql       # Existing: wishlist, progress
│   ├── blogs_policies.sql          # NEW: blogs
│   ├── instructors_policies.sql    # NEW: instructors
│   ├── learning_paths_policies.sql # NEW: learning paths
│   └── testimonials_policies.sql   # NEW: testimonials
├── seeds/                          # Seed data
│   ├── 000_categories_seed.sql     # Existing: categories
│   ├── 000_courses_seed.sql        # Existing: courses
│   ├── 001_blogs_seed.sql          # NEW: blogs
│   ├── 002_instructors_seed.sql    # NEW: instructors
│   ├── 003_learning_paths_seed.sql # NEW: learning paths
│   └── 004_testimonials_seed.sql   # NEW: testimonials
├── views/                          # Database views
│   ├── blog_views.sql
│   ├── instructor_and_learning_path_views.sql
│   └── testimonials_views.sql
├── functions/                      # Helper functions & triggers
│   ├── blog_functions.sql
│   └── instructor_and_testimonial_functions.sql
└── README.md                       # This file
```

## Execution Order

Run these files in Supabase SQL Editor **in this exact order**:

### Phase 1: Existing Schema Refactoring (100s)

| Step | File | Description |
|------|------|-------------|
| 1.1 | `migrations/000_initial_setup.sql` | Enable UUID extension |
| 1.2 | `migrations/101_profiles_table.sql` | Create profiles table |
| 1.3 | `migrations/102_courses_and_categories.sql` | Create courses, categories |
| 1.4 | `migrations/103_enrollments_reviews_wishlist.sql` | Create enrollments, reviews, wishlist, progress |
| 1.5 | `migrations/104_indexes.sql` | Create all indexes |
| 1.6 | `migrations/105_functions_triggers.sql` | Create functions & triggers |
| 1.7 | `migrations/106_views.sql` | Create database views |

### Phase 2: Existing RLS Policies (100s)

| Step | File | Description |
|------|------|-------------|
| 2.1 | `policies/profiles_policies.sql` | Apply profile policies |
| 2.2 | `policies/courses_policies.sql` | Apply course/category policies |
| 2.3 | `policies/enrollments_policies.sql` | Apply enrollment policies |
| 2.4 | `policies/reviews_policies.sql` | Apply review policies |
| 2.5 | `policies/wishlist_policies.sql` | Apply wishlist/progress policies |

### Phase 3: Existing Seeds (000s)

| Step | File | Description |
|------|------|-------------|
| 3.1 | `seeds/000_categories_seed.sql` | Insert sample categories |
| 3.2 | `seeds/000_courses_seed.sql` | Insert sample courses |

### Phase 4: New Tables (001-004)

| Step | File | Description |
|------|------|-------------|
| 4.1 | `migrations/001_add_blogs_table.sql` | Create blogs table with indexes |
| 4.2 | `migrations/002_add_instructors_table.sql` | Create instructors table with indexes |
| 4.3 | `migrations/003_add_learning_paths_table.sql` | Create learning_paths + junction table |
| 4.4 | `migrations/004_add_testimonials_table.sql` | Create testimonials table with indexes |

### Phase 5: New RLS Policies

| Step | File | Description |
|------|------|-------------|
| 5.1 | `policies/blogs_policies.sql` | Apply blog access policies |
| 5.2 | `policies/instructors_policies.sql` | Apply instructor access policies |
| 5.3 | `policies/learning_paths_policies.sql` | Apply learning path access policies |
| 5.4 | `policies/testimonials_policies.sql` | Apply testimonial access policies |

### Phase 6: New Helper Functions & Triggers

| Step | File | Description |
|------|------|-------------|
| 6.1 | `functions/blog_functions.sql` | Blog timestamps, slug generation |
| 6.2 | `functions/instructor_and_testimonial_functions.sql` | Instructor stats, timestamps |

### Phase 7: New Views

| Step | File | Description |
|------|------|-------------|
| 7.1 | `views/blog_views.sql` | Blog query views |
| 7.2 | `views/instructor_and_learning_path_views.sql` | Instructor & learning path views |
| 7.3 | `views/testimonials_views.sql` | Testimonial query views |

### Phase 8: New Seeds (001-004)

| Step | File | Description |
|------|------|-------------|
| 8.1 | `seeds/001_blogs_seed.sql` | Insert 5 sample blogs |
| 8.2 | `seeds/002_instructors_seed.sql` | Insert 4 sample instructors |
| 8.3 | `seeds/003_learning_paths_seed.sql` | Insert 3 learning paths |
| 8.4 | `seeds/004_testimonials_seed.sql` | Insert 4 testimonials |

## For Existing Production Databases

If you already have data in `supabase-schema.sql`:

### Option A: New Database (Recommended for fresh start)

1. Create new Supabase project
2. Run all migrations in order (1.1-8.4)

### Option B: Migrate Existing Database

1. **Backup first**: `pg_dump` your existing database
2. **Extract existing tables**: These migrations use `CREATE TABLE IF NOT EXISTS`, so they're safe to run on existing databases
3. **Skip seeds**: Only run seed files if you want sample data
4. **Add new features**: Run new migrations (4.1-8.4)

```bash
# Create backup
pg_dump -h your-host -U your-user -d your-database > backup_$(date +%Y%m%d).sql

# Run migrations (skip seeds if data exists)
# Execute in Supabase SQL Editor
```

## Frontend Integration

After database setup, update your Vue.js frontend to use Supabase:

### 1. Update Supabase Client

```javascript
// src/supabase.js - Already configured, no changes needed
```

### 2. Example: Fetching Blogs

```javascript
// In your blog store
const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
```

### 3. Example: Fetching Instructors

```javascript
// In your instructors store
const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('average_rating', { ascending: false })
```

### 4. Example: Fetching Learning Paths

```javascript
// In your learning paths store
const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('is_published', true)
    .order('display_order')
```

## Data Migration from JSON

If you have existing JSON data to migrate:

```sql
-- Example: Migrating blog posts from JSON
INSERT INTO blogs (title, slug, snippet, content, image, author, published_at, is_published, tags)
SELECT 
    title,
    lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g')),
    snippet,
    content,
    image,
    author,
    published_date::TIMESTAMP WITH TIME ZONE,
    true,
    tags::TEXT[]
FROM json_populate_recordset(NULL::blogs, '[
    {"title": "Sample Blog", ...}
]'::JSON);
```

## Verification Queries

Run these to verify successful setup:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Check seed data
SELECT 'profiles' as table, COUNT(*) as count FROM profiles
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'blogs', COUNT(*) FROM blogs
UNION ALL SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL SELECT 'learning_paths', COUNT(*) FROM learning_paths
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials;
```

## Rollback Plan

If you need to rollback new tables only:

```sql
-- Drop new tables (in reverse order)
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS learning_path_courses CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;

-- Drop views
DROP VIEW IF EXISTS featured_testimonials;
DROP VIEW IF EXISTS testimonials_with_learning_paths;
-- ... drop other views

-- Drop functions
DROP FUNCTION IF EXISTS update_blog_timestamp();
DROP FUNCTION IF EXISTS update_instructor_timestamp();
-- ... drop other functions
```

## Migration Numbering Convention

| Range | Purpose |
|-------|---------|
| 000-099 | Base setup, extensions |
| 100-199 | Existing schema refactoring |
| 200-299 | Future schema changes |
| 900-999 | Data migrations, one-offs |

## Next Steps

1. **Backup** your existing database
2. **Run migrations** in Supabase SQL Editor following the order above
3. **Verify setup** with verification queries
4. **Update frontend** to use new Supabase tables
5. **Set up CI/CD** for automated migrations (see Supabase CLI)
6. **Document changes** in your project wiki

## Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs
- Review RLS policies if access issues occur
- Use `SET ROLE postgres;` for debugging permission issues
