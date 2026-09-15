import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import ProviderDashboard from '../views/ProviderDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ResManagerDashboard from '../views/ResManagerDashboard.vue'
import CheckoutView from '../components/CheckoutView.vue'
import SafeHomeView from '../views/SafeHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/Bookstore.vue'),
    },
    {
      path: '/student-dashboard',
      name: 'student-dashboard',
      component: StudentDashboard,
    },
    {
      path: '/provider-dashboard',
      name: 'provider-dashboard',
      component: ProviderDashboard,
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
    },
    {
      path: '/resmanager-dashboard',
      name: 'resmanager-dashboard',
      component: ResManagerDashboard,
    },
    {
      path: '/safehome',
      name: 'safehome',
      component: SafeHomeView,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-panel-dashboard',
          component: () => import('../views/admin/AdminDashboard.vue'),
        },
        {
          path: 'dashboard',
          redirect: { name: 'admin-panel-dashboard' },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/AdminUsers.vue'),
        },
        {
          path: 'premium',
          name: 'admin-premium',
          component: () => import('../views/admin/AdminPremium.vue'),
        },
        {
          path: 'advertise',
          name: 'admin-advertise',
          component: () => import('../views/admin/AdminAdvertise.vue'),
        },
        {
          path: 'promote',
          name: 'admin-promote',
          component: () => import('../views/admin/AdminPromote.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: HomeView,
    },
  ],
})

export default router
