# Supabase Database Configuration

This directory contains production-ready Supabase database configuration for the E-Learning Platform.

## Directory Structure

```
supabase/
├── migrations/           # Schema changes (append-only)
│   ├── 000_initial_setup.sql           # UUID extension, pg_cron
│   ├── 101_profiles_table.sql         # User profiles
│   ├── 102_courses_and_categories.sql  # Courses & categories
│   ├── 103_enrollments_reviews_wishlist.sql  # Enrollments, reviews, wishlist, progress
│   ├── 104_add_blogs_table.sql        # Blog posts
│   ├── 105_add_instructors_table.sql  # Instructor profiles (with display_order)
│   ├── 106_add_learning_paths_table.sql # Learning journeys + junction
│   ├── 107_add_testimonials_table.sql # Student testimonials
│   ├── 008_views.sql                  # All database views consolidated
├── policies/              # Row Level Security policies
│   ├── profiles_policies.sql
│   ├── courses_policies.sql
│   ├── enrollments_policies.sql
│   ├── reviews_policies.sql
│   ├── wishlist_policies.sql
│   ├── blogs_policies.sql
│   ├── instructors_policies.sql
│   ├── learning_paths_policies.sql
│   └── testimonials_policies.sql
├── seeds/                 # Seed data for development
│   ├── 000_categories_seed.sql
│   ├── 000_courses_seed.sql
│   ├── 104_blogs_seed.sql
│   ├── 105_instructors_seed.sql
│   ├── 106_learning_paths_seed.sql
│   └── 107_testimonials_seed.sql
├── functions/             # Helper functions & triggers
│   ├── blog_functions.sql
│   └── instructor_and_testimonial_functions.sql
├── EXECUTION_PLAN.md      # Step-by-step execution guide
└── README.md              # This file
```

## Migration Numbering

| Range | Purpose |
|-------|---------|
| 000-099 | Base setup, extensions |
| 100-199 | Existing schema (refactored from supabase-schema.sql) |
| 008 | Views (consolidated) |

## All Tables

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profiles | Linked to auth.users, email, avatar, bio |
| `courses` | Course catalog | Rich JSONB fields, instructor info, ratings |
| `categories` | Course categories | Name, description, image |
| `enrollments` | User enrollments | Progress tracking, completion dates |
| `reviews` | Course reviews | Rating, comment, triggers course rating update |
| `wishlist` | User wishlist | User-course relationship |
| `course_progress` | Lesson progress | Section/lesson tracking, completion |

### Content Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `blogs` | Blog posts | slug, tags (GIN), view_count, is_published, is_featured |
| `instructors` | Instructor profiles | social_links (JSONB), expertise[], is_featured, display_order |
| `learning_paths` | Learning journeys | level, curriculum (JSONB), display_order |
| `testimonials` | Student testimonials | rating, is_approved, FK links to course/instructor/path |
| `learning_path_courses` | Junction table | module_order, lesson_order, is_required |

## Views Created (008_views.sql)

| View | Purpose |
|------|---------|
| `published_blogs` | Public blog list |
| `featured_blogs` | Homepage blog carousel |
| `blog_statistics` | Blog counts and totals |
| `featured_instructors` | Homepage instructor showcase |
| `instructors_with_profiles` | Instructors with user profiles |
| `learning_paths_with_courses` | Learning paths with course counts |
| `learning_paths_courses_detail` | Full curriculum with course details |
| `approved_testimonials` | Public testimonial list |
| `featured_testimonials` | Homepage testimonials |
| `testimonials_with_courses` | Testimonials with course info |
| `testimonials_with_learning_paths` | Testimonials with learning path info |
| `popular_courses` | Courses filtered by is_popular |
| `featured_courses` | Courses filtered by is_featured |
| `new_courses` | Courses from last 30 days |
| `course_statistics` | Aggregated stats by category |
| `user_enrolled_courses` | User's enrolled courses with progress |
| `course_reviews` | Reviews with user profile info |
| `user_wishlist` | Wishlist with course details |
| `courses_by_instructor` | Instructor course counts |

## Helper Functions

### Profile Functions
- `handle_new_user()`: Auto-create profile on auth signup

### Blog Functions
- `update_blog_timestamp()`: Auto-update updated_at
- `increment_blog_view_count(blog_uuid)`: Atomic view counter
- `generate_slug_from_title(title)`: URL-safe slug generation
- `get_unique_slug(title, exclude_id)`: Unique slug with auto-increment

### Instructor Functions
- `update_instructor_timestamp()`: Auto-update updated_at

### Testimonial Functions
- `update_testimonial_timestamp()`: Auto-update updated_at

## RLS Strategy

| Table | Public Read | Authenticated | User-Owned | Admin |
|-------|-------------|---------------|------------|-------|
| profiles | Yes | - | Update own | Full |
| courses | Yes | - | - | Full |
| categories | Yes | - | - | Full |
| enrollments | - | View, Create | Update own | Full |
| reviews | Yes | Create | Update own | Full |
| wishlist | - | View, Manage | Own only | Full |
| course_progress | - | View, Update | Own only | Full |
| blogs | Published | Create | Own drafts | Full |
| instructors | Active | - | Own profile | Full |
| learning_paths | Published | - | - | Full |
| testimonials | Approved | Create | Update own | Full |

## Design Decisions

### UUID Primary Keys
All tables use `UUID PRIMARY KEY DEFAULT gen_random_uuid()` for:
- Global uniqueness across distributed systems
- Security through obscurity
- Easy URL slugs (no exposing auto-increment IDs)

### Timestamp Conventions
- All tables include `created_at` and `updated_at`
- Uses `TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())`
- Frontend should handle timezone conversion

### JSONB Usage
- `social_links` in instructors: Flexible social media links
- `curriculum`, `sections` in courses: Structured nested data
- Enables partial updates without schema changes

### Display Order
- `instructors.display_order`: Controls display order on homepage
- `learning_paths.display_order`: Controls curriculum sequence

## Migration Best Practices

1. **Always** create migrations with `CREATE TABLE IF NOT EXISTS`
2. **Never** modify existing migrations after deployment
3. **Always** use `DROP POLICY IF EXISTS` before creating policies
4. **Use** `ON CONFLICT DO NOTHING` for seed data
5. **Document** each migration with purpose and dependencies

## Development Workflow

1. Create new migration in `migrations/`
2. Add RLS policies in `policies/`
3. Add helper functions in `functions/`
4. Create views in `008_views.sql`
5. Add seed data in `seeds/`
6. Update `EXECUTION_PLAN.md` with new steps

## Supabase CLI Integration

For automated deployments:

```bash
# Link to Supabase project
supabase link --project-ref your-project-ref

# Generate migration from local changes
supabase db diff > migrations/new_migration.sql

# Deploy migrations
supabase db push
```

## Rollback Strategy

For existing databases:
- New migrations use `IF NOT EXISTS` for safety
- Seeds use `ON CONFLICT DO NOTHING`
- Rely on Supabase CLI or manual backup for rollbacks

For new databases:
- Full rollback by dropping tables in reverse order
- See `EXECUTION_PLAN.md` for detailed rollback commands

## Related Files

- **Original Schema**: `supabase-schema.sql` (do not modify)
- **Frontend Stores**: `src/store/modules/` (Vuex stores for data fetching)
