import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import StudentDashboard from "../views/StudentDashboard.vue";
import ProviderDashboard from "../views/ProviderDashboard.vue";
import CheckoutView from "../components/CheckoutView.vue";
import SafeHomeView from "../views/SafeHomeView.vue";
import store from "../stores";

const roleForRoute = (role) =>
  role === "provider"
    ? "service_provider"
    : role === "resmanager"
      ? "res_manager"
      : role;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/contact", name: "contact", component: ContactView },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/TermsView.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/PrivacyView.vue"),
    },

    // Auth
    { path: "/login", name: "login", component: LoginView },
    {
      path: "/login/student",
      name: "student-login",
      component: LoginView,
      meta: { loginRole: "student" },
    },
    {
      path: "/login/provider",
      name: "provider-login",
      component: LoginView,
      meta: { loginRole: "provider" },
    },
    {
      path: "/login/admin",
      name: "admin-login",
      component: LoginView,
      meta: { loginRole: "admin" },
    },
    {
      path: "/login/resmanager",
      name: "resmanager-login",
      component: LoginView,
      meta: { loginRole: "resmanager" },
    },

    // Marketplace
    {
      path: "/books",
      name: "books",
      redirect: { path: "/marketplace", query: { tab: "books" } },
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: () => import("../views/MarketplaceView.vue"),
      meta: { allowedRoles: ["student", "admin"] },
    },
    {
      path: "/swap-requests",
      name: "swap-requests",
      component: () => import("../views/SwapRequestsView.vue"),
    },
    {
      path: "/sell-item",
      name: "sell-item",
      component: () => import("../views/SellItemView.vue"),
    },

    // Student
    {
      path: "/student-dashboard",
      name: "student-dashboard",
      component: StudentDashboard,
    },
    {
      path: "/student-profile",
      name: "student-profile",
      component: () => import("../views/RoleProfileView.vue"),
      meta: { profileRole: "student", allowedRoles: ["student"] },
    },
    {
      path: "/student-residence",
      name: "student-residence",
      component: () => import("../views/StudentResidence.vue"),
      meta: { allowedRoles: ["student"] },
    },

    // Provider
    {
      path: "/provider-dashboard",
      name: "provider-dashboard",
      component: ProviderDashboard,
    },
    {
      path: "/provider-jobs",
      name: "provider-jobs",
      component: () => import("../views/ProviderJobs.vue"),
    },
    {
      path: "/provider-jobs/available",
      name: "provider-available-jobs",
      component: () => import("../views/ProviderAvailableJobs.vue"),
    },
    {
      path: "/provider-profile",
      name: "provider-profile",
      component: () => import("../views/RoleProfileView.vue"),
      meta: {
        profileRole: "service_provider",
        allowedRoles: ["service_provider"],
      },
    },

    // Residence manager
    {
      path: "/resmanager-dashboard",
      name: "resmanager-dashboard",
      component: () => import("../views/ResManagerDashboard.vue"),
      meta: { allowedRoles: ["res_manager", "resmanager"] },
    },
    {
      path: "/resmanager-payments",
      name: "resmanager-payments",
      component: () => import("../views/ResManagerPayments.vue"),
      meta: { allowedRoles: ["res_manager", "resmanager"] },
    },
    {
      path: "/resmanager-profile",
      name: "resmanager-profile",
      component: () => import("../views/RoleProfileView.vue"),
      meta: {
        profileRole: "res_manager",
        allowedRoles: ["res_manager", "resmanager"],
      },
    },

    // Shared
    {
      path: "/notifications",
      name: "notifications",
      component: () => import("../views/NotificationsView.vue"),
    },
    {
      path: "/safehome",
      name: "safehome",
      component: SafeHomeView,
      meta: {
        allowedRoles: [
          "student",
          "service_provider",
          "res_manager",
          "resmanager",
        ],
      },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
      meta: { allowedRoles: ["student", "res_manager", "resmanager", "admin"] },
    },

    // Admin — the ONLY route for /admin is the layout + children.
    // The old standalone /admin-dashboard now redirects here so old links work.
    { path: "/admin-dashboard", redirect: { name: "admin-panel-dashboard" } },
    {
      path: "/admin",
      component: () => import("../views/AdminLayout.vue"),
      children: [
        {
          path: "",
          name: "admin-panel-dashboard",
          component: () => import("../views/admin/AdminDashboard.vue"),
        },
        { path: "dashboard", redirect: { name: "admin-panel-dashboard" } },
        {
          path: "users",
          name: "admin-users",
          component: () => import("../views/admin/AdminUsers.vue"),
        },
        {
          path: "premium",
          name: "admin-premium",
          component: () => import("../views/admin/AdminPremium.vue"),
        },
        {
          path: "advertise",
          name: "admin-advertise",
          component: () => import("../views/admin/AdminAdvertise.vue"),
        },
        {
          path: "promote",
          name: "admin-promote",
          component: () => import("../views/admin/AdminPromote.vue"),
        },
        {
          path: "profile",
          name: "admin-profile",
          component: () => import("../views/RoleProfileView.vue"),
          meta: { profileRole: "admin" },
        },
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

// Routes that require login.
const privatePrefixes = [
  "/student-dashboard",
  "/student-profile",
  "/student-residence",
  "/provider-",
  "/admin",
  "/resmanager-",
  "/books",
  "/marketplace",
  "/sell-item",
  "/checkout",
  "/safehome",
  "/notifications",
  "/swap-requests",
];

router.beforeEach((to) => {
  const loggedIn =
    store.getters["user/isLoggedIn"] &&
    localStorage.getItem("isLoggedIn") === "true";

  const requiresLogin = privatePrefixes.some((prefix) =>
    prefix.endsWith("-")
      ? to.path.startsWith(prefix)
      : to.path === prefix || to.path.startsWith(`${prefix}/`),
  );
  if (requiresLogin && !loggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  const allowedRoles = to.meta.allowedRoles;
  if (
    allowedRoles &&
    (!loggedIn ||
      !allowedRoles.includes(
        roleForRoute(store.getters["user/currentUser"]?.role),
      ))
  ) {
    return loggedIn
      ? { name: "home" }
      : { name: "login", query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
