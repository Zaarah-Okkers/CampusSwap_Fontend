import { createRouter, createWebHistory } from 'vue-router'
import SafeHomeView from '../views/safehOMEVIEW.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'safehome',
      component: SafeHomeView
    }
  ]
})

export default router