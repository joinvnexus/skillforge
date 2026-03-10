# Admin Panel Redesign Plan (Components-Based)

## Phase 1: Planning & Structure (Done)
1. Review current `AdminPanel.vue` layout and extract existing sections. ✅
2. Define admin modules and routes mapping (Users, Courses, Content, Paths, Reports, Settings). ✅
3. Decide UI direction (clean/modern/bold) and component naming. ✅

## Phase 2: Base Layout (Done)
1. Create `AdminLayout` with sidebar + topbar. ✅
2. Build `SidebarNav` (grouped navigation). ✅
3. Build `Topbar` (search, notifications, profile). ✅

## Phase 3: Dashboard (Done)
1. `KpiCards` for system KPIs. ✅
2. `RecentApprovals` list (pending courses). ✅ (overview quick tasks)
3. `SystemAlerts` (reports/flags). ✅ (reports card)

## Phase 4: Users Module (Done)
1. `UserTable` with filters. ✅
2. `UserDetailsDrawer` (role, status, actions). ✅ (inline edit actions)
3. `BulkActions` and `StatusToggle`. ✅ (status controls)

## Phase 5: Courses Module (Pending)
1. `CourseModerationTable`.
2. `CoursePreviewModal`.
3. `ApprovalActions` (approve/reject with reason).

## Phase 6: Content Module (Done)
1. `BlogManager`. ✅
2. `TestimonialsManager`. ✅
3. `CategoryManager`. ⏳ (not started)

## Phase 7: Learning Paths (Done)
1. `PathList`. ✅
2. `PathBuilder` (add/remove courses). ⏳ (not started)

## Phase 8: Reports & Audit (Partial)
1. `ReportQueue`. ✅ (reports card)
2. `AuditLogTable`. ⏳ (not started)

## Phase 9: Settings (Partial)
1. `SettingsTabs` (General, Payment, Email, Policies). ✅ (admin profile + account settings UI)

## Phase 10: Integration & Cleanup (Partial)
1. Connect to admin API routes. ✅ (existing routes)
2. Wire schema-based fields. ✅ (learning path fields)
3. Polish UI, empty states, loading states. ✅

## Instructor Panel Plan (Upcoming)
### Phase 1: Structure (Done)
1. `InstructorLayout` (sidebar + topbar) ✅
2. `InstructorSidebar` (Overview, Courses, Students, Revenue, Reviews, Settings) ✅
3. `InstructorTopbar` (quick actions + search) ✅

### Phase 2: Overview Dashboard (Done)
1. `InstructorKpiCards` (total students, revenue, avg rating) ✅
2. `InstructorRecentEnrollments` ✅ (Recent Courses)
3. `InstructorCourseHealth` (completion, dropoff, reviews) ✅

### Phase 3: Courses Module (Partial)
1. `InstructorCoursesTable` (status, enrollments, rating) ✅
2. `CourseActions` (edit, publish, archive) ⏳ (status change only)
3. `CoursePreviewModal` ⏳

### Phase 4: Students Module (Partial)
1. `StudentList` (filterable) ✅
2. `StudentProgressDrawer` ⏳
3. `Announcements` (send updates) ⏳

### Phase 5: Revenue & Payouts (Partial)
1. `RevenueSummary` ✅ (UI placeholder)
2. `PayoutHistory` ⏳
3. `Tax/Bank Info` ⏳

### Phase 6: Reviews & Q&A (Partial)
1. `ReviewsTable` ✅ (UI placeholder)
2. `ReplyModal` ⏳
3. `QnAThreadList` ⏳

### Phase 7: Settings (Partial)
1. `ProfileSettings` ✅ (UI placeholder)
2. `PayoutSettings` ✅ (UI placeholder)
3. `NotificationSettings` ✅ (UI placeholder)

### Phase 8: Integration & Polish (Partial)
1. API wiring ⏳
2. Loading/empty states ✅
3. UI polish ✅
