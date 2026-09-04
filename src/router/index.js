import { createRouter, createWebHistory } from 'vue-router'

// Import all view components
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import AcademicView from '../views/AcademicView.vue'
import SafeHomeView from '../views/SafeHomeView.vue'
import CheckoutView from '../views/CheckoutView.vue'


// Define route paths and matching components
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  // ADD THESE TWO ROUTES BELOW TO FIX THE BLANK PAGE:
  {
    path: '/student-dashboard',
    name: 'student-dashboard',
    component: DashboardView
  },
  {
    path: '/provider-dashboard',
    name: 'provider-dashboard',
    component: DashboardView
  },
  {
    path: '/academic',
    name: 'academic',
    component: AcademicView
  },
  {
    path: '/safehome',
    name: 'safehome',
    component: SafeHomeView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView
  }
]

// Initialize the Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Single default export
export default router