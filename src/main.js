import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import Swal from 'sweetalert2'
import { session } from './services/api'

// Restore both the login flag and the actual account so a page refresh does
// not silently turn a provider/admin back into the default student profile.
const savedUser = session.get()
if (savedUser && savedUser.id !== 'logged-out' && savedUser.role !== 'logged_out') {
  store.commit('user/setCurrentUser', savedUser)
  store.commit('user/setLoggedIn', true)
  localStorage.setItem('isLoggedIn', 'true')
} else if (!savedUser) {
  // A visitor without a saved session is a public visitor. Do not turn them
  // into the seeded student account simply by opening the site.
  store.commit('user/logout')
  localStorage.removeItem('isLoggedIn')
} else {
  localStorage.removeItem('isLoggedIn')
}

const app = createApp(App)
app.config.globalProperties.$swal = Swal

app.use(router)
app.use(store)

app.mount('#app')
