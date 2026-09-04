import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
