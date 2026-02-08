# Supabase Migration Execution Plan

## Overview

This document provides the step-by-step execution plan for migrating your E-Learning platform's Supabase schema.

## Current State

- **Migration Files**: Located in `supabase/migrations/`
- **Views**: Consolidated in `008_views.sql`
- **Database**: Already deployed and synced

## Folder Structure

```
supabase/
├── migrations/
│   ├── 000_initial_setup.sql           # UUID extension
│   ├── 101_profiles_table.sql         # User profiles
│   ├── 102_courses_and_categories.sql  # Courses & categories
│   ├── 103_enrollments_reviews_wishlist.sql  # Enrollments, reviews, wishlist, progress
│   ├── 104_add_blogs_table.sql        # Blog posts
│   ├── 105_add_instructors_table.sql  # Instructor profiles (with display_order)
│   ├── 106_add_learning_paths_table.sql # Learning journeys + junction
│   ├── 107_add_testimonials_table.sql # Student testimonials
│   └── 008_views.sql                  # All database views consolidated
├── policies/                           # RLS policies
├── seeds/                             # Seed data
│   ├── 000_categories_seed.sql
│   ├── 000_courses_seed.sql
│   ├── 104_blogs_seed.sql
│   ├── 105_instructors_seed.sql
│   ├── 106_learning_paths_seed.sql
│   └── 107_testimonials_seed.sql
├── functions/                          # Helper functions & triggers
└── README.md                          # Documentation
```

## Deployment

### Using Supabase CLI

```bash
# Link to Supabase project
supabase link --project-ref your-project-ref

# Deploy migrations
supabase db push
```

### Manual Deployment

Run migration files in Supabase SQL Editor in this order:

| Step | File | Description |
|------|------|-------------|
| 1 | `migrations/000_initial_setup.sql` | Enable UUID extension |
| 2 | `migrations/101_profiles_table.sql` | Create profiles table |
| 3 | `migrations/102_courses_and_categories.sql` | Create courses, categories |
| 4 | `migrations/103_enrollments_reviews_wishlist.sql` | Create enrollments, reviews, wishlist, progress |
| 5 | `migrations/104_add_blogs_table.sql` | Create blogs table |
| 6 | `migrations/105_add_instructors_table.sql` | Create instructors table |
| 7 | `migrations/106_add_learning_paths_table.sql` | Create learning_paths + junction |
| 8 | `migrations/107_add_testimonials_table.sql` | Create testimonials table |
| 9 | `policies/*.sql` | Apply RLS policies |
| 10 | `functions/*.sql` | Create helper functions |
| 11 | `migrations/008_views.sql` | Create all views |
| 12 | `seeds/*.sql` | Insert sample data |

## Verification

Run these queries to verify setup:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check seed data
SELECT 'profiles' as table, COUNT(*) as count FROM profiles
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'blogs', COUNT(*) FROM blogs
UNION ALL SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL SELECT 'learning_paths', COUNT(*) FROM learning_paths
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials;
```

## Rollback

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
-- ... other views from 008_views.sql
```

## Related Files

- **README.md**: Detailed documentation
- **supabase-schema.sql**: Original schema (do not modify)
