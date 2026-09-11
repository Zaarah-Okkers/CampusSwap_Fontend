import { createRouter, createWebHistory } from 'vue-router'

// lerato's pages 
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import StudentDashboard from '../views/StudentDashboard.vue'   
import ProviderDashboard from '../views/ProviderDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ResManagerDashboard from '../views/ResManagerDashboard.vue' 

// Anela's pages 
import CheckoutView from '../components/CheckoutView.vue' 
 

const routes = [
  { path: '/', 
    name: 'home', 
    component: HomeView 
  },

  { path: '/login', 
    name: 'login', 
    component: LoginView 
  },

  { path: '/student-dashboard', 
    name: 'student-dashboard', 
    component: StudentDashboard 
  },

  { path: '/provider-dashboard', 
    name: 'provider-dashboard', 
    component: ProviderDashboard 
  },

  { path: '/admin-dashboard', 
    name: 'admin-dashboard', 
    component: AdminDashboard 
  },

  { path: '/resmanager-dashboard', 
    name: 'resmanager-dashboard', 
    component: ResManagerDashboard 
  },

  // { path: '/academic', 
  //   name: 'academic', 
  //   component: AcademicView 
  // },

  // { path: '/safehome', 
  //   name: 'safehome', 
  //   component: SafeHomeView 
  // },

  { path: '/checkout', 
    name: 'checkout', 
    component: CheckoutView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router