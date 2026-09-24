import './assets/main.css'

import { createApp } from 'vue'
import Swal from 'sweetalert2'

import App from './App.vue'
import router from './router'
import store from './stores'
import { session } from './services/api'


// Restore the saved session before the app boots.
//
// Vuex state resets every time the page loads, so without this a logged-in
// user would be bounced to /login on refresh even though their token is
// still sitting in localStorage. We check three things to be safe:
//   1. a user object exists in localStorage
//   2. it's a real account (not the 'logged-out' placeholder)
//   3. the isLoggedIn flag is 'true'
// If all three pass, we trust the session. Otherwise we clear everything so
// a stale half-logged-in state can't survive.

function restoreSession() {
  const savedUser = session.get()
  const isRealUser = savedUser && savedUser.role && savedUser.role !== 'logged_out'
  const flagIsSet = localStorage.getItem('isLoggedIn') === 'true'

  if (isRealUser && flagIsSet) {
    store.commit('user/setCurrentUser', savedUser)
    store.commit('user/setLoggedIn', true)
    return
  }

  // No valid session → start fresh as a public visitor.
  store.commit('user/logout')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  localStorage.removeItem('userRole')
}

restoreSession()

// ---------------------------------------------------------------------------
// Boot the app.
// Store must be registered before the router so that navigation guards can
// read from it on the very first route resolution.
// ---------------------------------------------------------------------------
const app = createApp(App)

app.config.globalProperties.$swal = Swal

app.use(store)
app.use(router)

app.mount('#app')