# Skillshare Website TODO (Audit)

Audit date: 2026-03-09

## P0 - Core Functional Gaps (Must Do First)

- [x] Implement real password reset flow (backend endpoints + email token + frontend pages).  
  Done: `POST /auth/forgot-password`, `POST /auth/reset-password`, store actions wired, pages added (`/forgot-password`, `/reset-password`).
- [x] Implement email change flow with verification.  
  Done: request + token confirm endpoints, settings UI request form, confirm page (`/confirm-email-change`).
- [x] Replace "Checkout (Mock Paid)" with real payment lifecycle (init, success, fail, webhook/verification).  
  Done: pending order creation, payment intent init, success/fail verification endpoint, and mock webhook with secret verification.
- [x] Add centralized form validation (frontend + backend) for auth/profile/course create/edit.  
  Done: shared backend validators used across auth/profile/instructor course create-edit routes; shared frontend validators applied in login/signup/forgot/reset/settings and instructor course create-edit forms.
- [x] Add role-safe profile update endpoint (single `/me/profile` route or role-aware service) and enforce consistent API contract.  
  Done: unified `PATCH /auth/me/profile` for all roles, frontend profile update moved to this contract.

## P1 - Role Workflow Completion

- [x] Student: add order details page (single order view with items, status timeline, payment reference).  
  Done: `GET /student/me/orders/:orderId`, dashboard route `/dashboard/orders/:orderId`, itemized details card, and status timeline view.
- [x] Student: add enrollment lesson progress UI tied to `/student/me/lessons/:lessonId/progress`.  
  Done: enrollments API now returns sections/lessons + completion data; dashboard `My Enrolled Courses` supports lesson-level complete/incomplete actions that persist via progress endpoint.
- [x] Instructor: expand course studio (sections, lessons, upload resources, preview course).  
  Done: studio detail API, section/lesson creation UI, lesson editor with resource URLs, and course preview action from instructor dashboard.
- [x] Instructor: add profile edit endpoint + UI for title/bio/social links/expertise.  
  Done: added `GET/PATCH /instructor/me/profile` and role-based instructor settings form for title, bio, expertise, and social URLs.
- [x] Admin: add pagination/filter/search for orders/testimonials/users in AdminPanel.  
  Done: backend query support for user role/status/search, order status/search, testimonial approved/search with pagination; AdminPanel wired with filters and paged navigation.
- [x] Admin: add learning path/blog management UI (backend exists, dashboard UI still minimal).  
  Done: admin panel now supports listing/filtering/paging plus create/update controls for learning paths and blogs.

## P1 - Frontend Quality/UX

- [x] Standardize loading/error/empty states across all dashboard pages.  
  Done: introduced shared `DashboardState` UI and applied it across dashboard overview, admin panel, instructor studio, orders, order details, enrollments, wishlist, and cart.
- [x] Add global success/error toast system (currently many pages use inline error text only).  
  Done: added centralized `ui` toast queue + global `ToastStack` renderer and wired auth/cart/orders/admin flows to emit success/error toasts.
- [ ] Improve accessibility: keyboard focus flow, form labels/help text, aria for interactive cards/buttons.
- [ ] Replace external avatar fallback dependency with local fallback component (for reliability).
- [ ] Add image upload flow (Supabase storage/S3) instead of URL-only profile image input.

## P2 - Data/Content/SEO

- [ ] Remove placeholder image fallback dependencies and provide curated local placeholders.
- [ ] Add SEO meta tags per route (title/description/OpenGraph).
- [ ] Add sitemap + robots configuration for production.
- [ ] Add structured data for courses/blog posts.

## P2 - Testing/Engineering

- [ ] Add backend integration tests for auth, student, instructor, admin route groups.
- [ ] Add frontend smoke tests for login/signup/dashboard role redirects.
- [ ] Add e2e tests for cart -> checkout -> enrollment flow.
- [ ] Add lint + format + type-check scripts in root and CI pipeline.
- [ ] Add API error contract tests (status code + message consistency).

## P2 - DevOps/Release

- [ ] Add production env documentation (frontend + server).
- [ ] Add healthcheck + readiness probes for deployment.
- [ ] Add basic monitoring/logging strategy (request logs, error tracking).
- [ ] Add backup/restore notes for PostgreSQL/Supabase.

## Quick Suggested Execution Order

1. P0 payment + auth recovery flows
2. Instructor/Admin workflow depth
3. Test coverage + CI
4. SEO + deployment hardening
