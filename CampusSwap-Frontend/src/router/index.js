import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import AdminView from '../views/AdminView.vue'
import BookStore from '../views/Bookstore.vue'

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
      component: ChatView,
    },
    {
      path: '/chat/:id',
      name: 'chat-detail',
      component: ChatView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/books',
      name: 'books',
      component: BookStore,
    },
  ],
})

export default router