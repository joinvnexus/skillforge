# QA Test Plan Implementation Tasks

Scope: implement automated tests + manual checks in stages. We will follow this file step-by-step.

## Phase 0 - Foundations
1. [x] Add backend test runner and structure (Vitest + Supertest).
2. [x] Add basic test env bootstrap (mock prisma, env vars).
3. [x] Add `npm test` scripts (server + root if needed).
4. [x] Decide on E2E tool for frontend (Playwright or Cypress).

## Phase 1 - Smoke (P0)
Backend API smoke tests:
1. [x] Auth: register (student), login, logout, `/auth/me`.
2. [x] Auth: refresh token flow (valid + invalid).
3. [x] Role middleware: admin route access blocked for non-admin.

Frontend smoke (manual or automated):
4. [x] Login + logout UI.
5. [x] Role-based dashboard redirect for Student/Instructor/Admin.
6. [x] Public routes: home, course list, course detail.

## Phase 2 - Core Functional (P1)
Student purchase workflow:
1. [x] Create order with published courses.
2. [x] Payment intent -> verify success.
3. [x] Enrollment created after payment success.
4. [ ] Order failure flow sets `FAILED`.

Admin workflows:
5. [ ] Order update: mark `PAID` and `REFUNDED` (verify enrollments).
6. [x] Course status update: REVIEW -> PUBLISHED (reviewer note).
7. [x] Blog create/update status.
8. [x] Learning path create/update.
9. [x] Testimonial approve/feature.

Instructor workflows:
10. [x] Create course.
11. [ ] Update course fields.
12. [x] Create sections and lessons.
13. [ ] Submit course to REVIEW.
14. [x] Instructor reply to review creates notification.
15. [x] Instructor announcement creates notifications.

Student learning:
16. [ ] Enrollments list includes sections/lessons.
17. [x] Lesson progress updates enrollment percent/status.
18. [x] Review submission (rating validation, enroll required).

## Phase 3 - Error/Edge (P1)
1. [x] Validation errors on all create/update endpoints.
2. [x] Auth errors: missing/expired token.
3. [ ] Empty states for dashboards (no courses, no orders).
4. [x] Payment webhook wrong secret -> 401.
5. [x] Course detail not found returns 404.

## Phase 4 - Regression (P2)
1. [x] Password reset flow.
2. [x] Email change confirm flow.
3. [x] Enrollment progress + completion.
4. [x] Admin filters/pagination (users/orders/testimonials).
5. [x] UI loading/error/empty states consistent.

## Phase 5 - QA Docs & CI (P2)
1. [x] Add README QA section (how to run tests).
2. [x] Add basic CI pipeline for tests.
