import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

// I added these blank placeholders so i can see how the project will look.
import AcademicView from '../views/AcademicView.vue'
import SafeHomeView from '../views/SafeHomeView.vue'
import CheckoutView from '../views/CheckoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: 
  [
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
    },
  ]
})

export default router