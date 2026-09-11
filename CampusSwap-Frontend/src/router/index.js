import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboard.vue'),
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboard.vue'),
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