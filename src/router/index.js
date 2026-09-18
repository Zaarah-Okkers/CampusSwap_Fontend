import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import StudentDashboard from "../views/StudentDashboard.vue";
import ProviderDashboard from "../views/ProviderDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import ResManagerDashboard from "../views/ResManagerDashboard.vue";
import Bookstore from "../views/Bookstore.vue";
import SafeHomeView from "../views/SafeHomeView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import MarketplaceView from "../views/MarketplaceView.vue";
import ChatView from "../views/ChatView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/student-dashboard",
    name: "student-dashboard",
    component: StudentDashboard,
  },
  {
    path: "/provider-dashboard",
    name: "provider-dashboard",
    component: ProviderDashboard,
  },
  {
    path: "/admin-dashboard",
    name: "admin-dashboard",
    component: AdminDashboard,
  },
  {
    path: "/resmanager-dashboard",
    name: "resmanager-dashboard",
    component: ResManagerDashboard,
  },
  {
    path: "/marketplace",
    name: "marketplace",
    component: MarketplaceView,
  },
  {
    path: "/academic",
    name: "academic",
    component: Bookstore,
  },
  {
    path: "/safehome",
    name: "safehome",
    component: SafeHomeView,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// ============================================================
// ROUTE GUARD
// Public routes can be viewed by anyone. Protected routes require login.
// ============================================================
router.beforeEach((to, from, next) => {
  const publicPages = [
    "/",
    "/about",
    "/contact",
    "/login",
    "/marketplace",
    "/academic",
    "/safehome",
    "/chat",
  ];

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (publicPages.includes(to.path)) {
    return next();
  }

  // Not logged in → send to login
  if (!user) {
    return next("/login");
  }

  next();
});

export default router;
