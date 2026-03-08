# Prisma Platform Blueprint

## Goal

Replace the current frontend-to-Supabase coupling with a backend-first architecture:

- Frontend: Vue 3 + Vuex + Vue Router
- API: Node.js + Express
- Database: PostgreSQL via Prisma
- Auth: JWT access token + refresh session table
- Roles: `STUDENT`, `INSTRUCTOR`, `ADMIN`

This keeps the UI flexible and makes role-based access, admin tools, analytics, payments, and progress tracking much easier to maintain.

## Why The Current Structure Needs Refactor

Current project state:

- The Vue app calls Supabase directly from store modules.
- Auth and data permissions are mixed into the frontend.
- Admin and instructor features do not have a clean backend boundary.
- Course/instructor/blog/testimonial data exists, but the system is not normalized enough for a production-ready LMS.

Target direction:

- Frontend only talks to `/api/v1/...`
- Backend owns auth, roles, validation, business rules, and Prisma queries
- Database becomes a fresh PostgreSQL schema managed by Prisma migrations

## Recommended Roles

| Role | Purpose |
| --- | --- |
| `STUDENT` | Browse, enroll, track progress, review, wishlist |
| `INSTRUCTOR` | Create and manage own courses, sections, lessons, students |
| `ADMIN` | Moderate content, manage users, publish courses, manage learning paths/blogs/testimonials |

If later needed, `ADMIN` can be split into `SUPER_ADMIN`, `EDITOR`, or `SUPPORT`, but that is not required now.

## Target UI Structure

### Public Site

- `/` Home
- `/courses`
- `/courses/:slug`
- `/learning-paths`
- `/learning-paths/:slug`
- `/blog`
- `/blog/:slug`
- `/instructors`
- `/login`
- `/register`

### Student Dashboard

- `/dashboard`
- `/dashboard/my-courses`
- `/dashboard/wishlist`
- `/dashboard/profile`
- `/dashboard/settings`
- `/dashboard/notifications`

### Instructor Dashboard

- `/instructor`
- `/instructor/courses`
- `/instructor/courses/new`
- `/instructor/courses/:id/edit`
- `/instructor/students`
- `/instructor/reviews`

### Admin Panel

- `/admin`
- `/admin/users`
- `/admin/courses`
- `/admin/blogs`
- `/admin/learning-paths`
- `/admin/testimonials`
- `/admin/orders`
- `/admin/settings`

## UI Design Direction

Keep one visual system, but separate surfaces:

- Public site:
  - large editorial hero
  - category/course cards
  - learning-path sections
  - instructor spotlight and testimonials
- Student dashboard:
  - clean progress-driven layout
  - stats row, continue-learning cards, wishlist table
- Instructor dashboard:
  - content-focused layout
  - course status chips, lesson builder, enrollment overview
- Admin panel:
  - dense utility UI
  - left sidebar, table views, filters, approval queues, analytics cards

## API Shape

Base prefix:

```txt
/api/v1
```

### Public

- `GET /home`
- `GET /categories`
- `GET /courses`
- `GET /courses/:slug`
- `GET /learning-paths`
- `GET /learning-paths/:slug`
- `GET /blogs`
- `GET /blogs/:slug`
- `GET /instructors`
- `GET /instructors/:id`
- `GET /testimonials/featured`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Student

- `GET /student/dashboard/overview`
- `GET /student/me/profile`
- `PATCH /student/me/profile`
- `GET /student/me/enrollments`
- `POST /student/me/enrollments`
- `GET /student/me/wishlist`
- `POST /student/me/wishlist`
- `DELETE /student/me/wishlist/:courseId`
- `POST /student/me/reviews`
- `PATCH /student/me/lessons/:lessonId/progress`

### Instructor

- `GET /instructor/dashboard/overview`
- `GET /instructor/courses`
- `POST /instructor/courses`
- `PATCH /instructor/courses/:courseId`
- `PATCH /instructor/courses/:courseId/status`
- `POST /instructor/courses/:courseId/sections`
- `POST /instructor/sections/:sectionId/lessons`
- `GET /instructor/courses/:courseId/enrollments`

### Admin

- `GET /admin/dashboard/overview`
- `GET /admin/users`
- `PATCH /admin/users/:id`
- `GET /admin/courses`
- `PATCH /admin/courses/:id/status`
- `GET /admin/testimonials/pending`
- `PATCH /admin/testimonials/:id`
- `POST /admin/learning-paths`
- `POST /admin/blogs`

## Prisma Model Summary

The new schema should cover:

- `User`
- `AuthSession`
- `InstructorProfile`
- `Category`
- `Course`
- `CourseSection`
- `Lesson`
- `CourseFaq`
- `Enrollment`
- `LessonProgress`
- `Review`
- `WishlistItem`
- `LearningPath`
- `LearningPathCourse`
- `BlogPost`
- `Testimonial`
- `Coupon`
- `Order`
- `OrderItem`
- `Notification`
- `AuditLog`

## Frontend Refactor Boundary

All current direct Supabase calls should move behind API services.

Recommended replacement pattern:

1. Keep Vuex modules.
2. Replace `supabase.from(...)` calls with `fetch` or `axios` calls to backend services.
3. Keep auth state in Vuex, but source it from API tokens instead of Supabase session.
4. Remove `src/supabase.js` only after all store modules are migrated.

## Migration Order

1. Add backend and Prisma schema.
2. Create PostgreSQL database and apply Prisma migration.
3. Build auth and public read endpoints.
4. Migrate course, blog, instructor, learning-path, testimonial modules to REST API.
5. Add student dashboard endpoints.
6. Add instructor dashboard.
7. Add admin panel endpoints.
8. Remove Supabase client and SQL-based schema once all reads/writes are moved.

## Environment

Backend:

```txt
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:5173
PORT=4000
```

Frontend:

```txt
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Practical Recommendation

Do not try to keep Supabase and Prisma active in parallel for long.

Best path for this project:

- start a fresh PostgreSQL database
- move to Prisma immediately
- build API layer first
- migrate frontend module by module
