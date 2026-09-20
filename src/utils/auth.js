import Swal from 'sweetalert2'
import { session } from '../services/api'

// NOTE: `store` and `router` are imported lazily inside handleLogout().
// Importing them at module scope created a cycle
// (main -> App -> SideNav -> auth -> router/stores -> views) that stopped the
// dev server ever finishing module evaluation, leaving a blank screen.
export async function handleLogout(confirm = true) {
  const { default: store } = await import('../stores')
  const { default: router } = await import('../router')

  if (confirm) {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out of your account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    })
    if (!result.isConfirmed) return false
  }

  const role = store.getters['user/currentUser']?.role
  const logoutMessages = {
    student: 'Session terminated. Go touch grass.',
    service_provider: 'Mission accomplished. Over and Out chief.',
    admin: 'God mode disabled.',
    res_manager: 'Game saved. Player 1 has left the lobby.',
    resmanager: 'Game saved. Player 1 has left the lobby.'
  }
  session.clear()
  await store.dispatch('user/logout')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')

  await Swal.fire({
    title: 'Logged Out',
    text: logoutMessages[role] || 'You have been logged out successfully.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  })

  router.push('/login')
  return true
}

