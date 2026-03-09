import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/courses",
      name: "courses",
      component: () => import("../views/CourseList.vue"),
    },
    {
      path: "/courses/:id",
      name: "CourseDetail",
      component: () => import("@/views/CourseDetail.vue"),
      props: true,
    },
    {
      path: "/beginner",
      name: "BeginnerPath",
      component: () => import("@/views/learning-paths/Beginner.vue"),
      meta: { title: "Beginner Learning Path" },
    },
    {
      path: "/intermediate",
      name: "IntermediatePath",
      component: () => import("@/views/learning-paths/Intermediate.vue"),
      meta: { title: "Intermediate Learning Path" },
    },
    {
      path: "/advanced",
      name: "AdvancedPath",
      component: () => import("@/views/learning-paths/Advanced.vue"),
      meta: { title: "Advanced Learning Path" },
    },
    {
      path: "/search",
      name: "SearchResults",
      component: () => import("@/views/SearchResults.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/Signup.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/blog",
      name: "Blog",
      component: () => import("@/views/BlogView.vue"),
      meta: { title: "Blog" },
    },
    {
      path: "/resources",
      name: "Resources",
      component: () => import("@/views/ResourcesView.vue"),
      meta: { title: "Resources" },
    },
    {
      path: "/contact",
      name: "Contact",
      component: () => import("@/views/ContactView.vue"),
      meta: { title: "Contact Us" },
    },
    {
      path: "/support",
      name: "Support",
      component: () => import("@/views/SupportView.vue"),
      meta: { title: "Support Center" },
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: () => import("@/views/ForgotPassword.vue"),
      meta: { requiresGuest: true, title: "Forgot Password" },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/Dashboard.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "DashboardOverview",
          component: () => import("@/views/dashboard/RoleOverview.vue"),
          meta: { title: "Dashboard" }
        },
        {
          path: "my-courses",
          name: "MyEnrolledCourses",
          component: () => import("@/views/dashboard/MyEnrolledCourses.vue"),
          meta: { title: "My Courses", requiresRole: ["STUDENT"] }
        },
        {
          path: "wishlist",
          name: "WishlistView",
          component: () => import("@/views/dashboard/WishlistView.vue"),
          meta: { title: "Wishlist", requiresRole: ["STUDENT"] }
        },
        {
          path: "cart",
          name: "CartView",
          component: () => import("@/views/dashboard/CartView.vue"),
          meta: { title: "Cart", requiresRole: ["STUDENT"] }
        },
        {
          path: "orders",
          name: "OrdersView",
          component: () => import("@/views/dashboard/OrdersView.vue"),
          meta: { title: "Orders", requiresRole: ["STUDENT"] }
        },
        {
          path: "profile",
          name: "UserProfile",
          component: () => import("@/views/dashboard/UserProfile.vue"),
          meta: { title: "User Profile" }
        },
        {
          path: "settings",
          name: "UserSettings",
          component: () => import("@/views/dashboard/UserSettings.vue"),
          meta: { title: "User Settings" }
        },
        {
          path: "instructor-courses",
          name: "InstructorCourses",
          component: () => import("@/views/dashboard/InstructorCourses.vue"),
          meta: { title: "Instructor Courses", requiresRole: ["INSTRUCTOR"] }
        },
        {
          path: "admin-panel",
          name: "AdminPanel",
          component: () => import("@/views/dashboard/AdminPanel.vue"),
          meta: { title: "Admin Panel", requiresRole: ["ADMIN"] }
        }
      ],
    },
    {
      path: "/profile",
      redirect: "/dashboard/profile"
    }
  ],
  // Scroll behavior to scroll to the top of the page on navigation

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});
// Navigation guard to check auth status
router.beforeEach(async (to, from, next) => {
  await store.dispatch("auth/initializeAuth");

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  const roleRequirement = to.matched.find((record) => record.meta.requiresRole)?.meta.requiresRole;
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const role = store.getters["auth/userRole"];

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (requiresGuest && isAuthenticated) {
    next("/dashboard");
  } else if (roleRequirement && !roleRequirement.includes(role)) {
    next("/dashboard");
  } else {
    next();
  }
});
// Set the document title based on the route meta title

export default router;
