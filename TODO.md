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
