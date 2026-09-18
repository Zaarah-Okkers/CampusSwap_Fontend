import Swal from 'sweetalert2'
import store from '../stores'
import router from '../router'
import { session } from '../services/api'

export async function handleLogout(confirm = true) {
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

  session.clear()
  await store.dispatch('user/logout')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')

  await Swal.fire({
    title: 'Logged Out',
    text: 'You have been logged out successfully.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  })

  router.push('/login')
  return true
}

