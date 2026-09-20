<template>
  <main class="resmanager-page"><div class="resmanager-shell">
    <header class="page-heading"><div><p class="eyebrow">Residence management</p><h1>My profile</h1><p class="muted">Manage your residence manager details and account preferences.</p></div><router-link class="button button-primary" to="/resmanager-dashboard">Back to dashboard</router-link></header>

    <section class="profile-grid">
      <article class="panel glass-panel">
        <div class="profile-identity"><div class="avatar">{{ initials }}</div><div><h2>{{ currentUser.name }}</h2><p class="muted">Residence Manager</p><p class="muted">{{ currentUser.email }}</p></div></div>
        <div class="profile-fields"><div><span>Residence</span><strong>{{ currentUser.university || 'Smuts Hall Residence' }}</strong></div><div><span>Account status</span><strong class="verified">Verified manager</strong></div><div><span>Member since</span><strong>September 2026</strong></div></div>
      </article>

      <article class="panel glass-panel">
        <div class="panel-heading"><div><p class="eyebrow">Security</p><h2>Change password</h2></div></div>
        <form class="password-form" @submit.prevent="changePassword">
          <label>Current password<input v-model="currentPassword" type="password" required /></label>
          <label>New password<input v-model="newPassword" type="password" minlength="6" required /></label>
          <label>Confirm new password<input v-model="confirmPassword" type="password" minlength="6" required /></label>
          <p v-if="error" class="form-error">{{ error }}</p><p v-if="saved" class="form-success">Password updated successfully.</p>
          <button class="button button-primary" type="submit">Update password</button>
        </form>
      </article>
    </section>
  </div></main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { authAPI } from '../services/api'

const store = useStore()
const currentUser = computed(() => store.getters['user/currentUser'] || {})
const initials = computed(() => (currentUser.value.name || 'RM').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase())
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const saved = ref(false)

async function changePassword() {
  saved.value = false
  error.value = ''
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New password and confirmation must match.'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'
    return
  }
  try {
    await authAPI.changePassword(currentUser.value.id, currentPassword.value, newPassword.value)
    saved.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    error.value = err.message || 'Password update failed.'
  }
}
</script>

<style scoped>
.resmanager-page{min-height:100vh;padding:42px 24px 120px}.resmanager-shell{width:min(1100px,100%);margin:0 auto}.page-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:30px}h1{font-size:clamp(2rem,4vw,3.2rem);margin:6px 0}.eyebrow{color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.muted{color:var(--text-muted)}.button{border:0;border-radius:9px;cursor:pointer;font-weight:700;padding:12px 16px;white-space:nowrap}.button-primary{background:var(--gold);color:var(--ink)}.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.panel{padding:24px}.profile-identity{align-items:center;display:flex;gap:16px;margin-bottom:30px}.avatar{align-items:center;background:var(--gold);border-radius:50%;color:var(--ink);display:flex;font-family:'Fraunces',Georgia,serif;font-size:1.5rem;font-weight:700;height:68px;justify-content:center;width:68px}.panel h2{font-size:1.35rem;margin:4px 0}.profile-fields{border-top:1px solid var(--glass-border);display:grid;gap:18px;padding-top:20px}.profile-fields span{color:var(--text-faint);display:block;font-size:11px;text-transform:uppercase}.profile-fields strong{display:block;font-size:14px;margin-top:4px}.verified,.form-success{color:var(--mint)}.panel-heading{border-bottom:1px solid var(--glass-border);margin-bottom:20px;padding-bottom:16px}.password-form{display:grid;gap:16px}.password-form label{color:var(--text-muted);font-size:12px}.password-form input{background:var(--glass-strong);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);display:block;margin-top:6px;padding:11px 12px;width:100%}.form-error{color:var(--coral);font-size:13px}.form-success{font-size:13px}.password-form .button{width:fit-content}@media(max-width:700px){.resmanager-page{padding:24px 14px 110px}.page-heading{align-items:start;flex-direction:column}.button{width:100%;text-align:center}.profile-grid{grid-template-columns:1fr}.panel{padding:18px}}
.resmanager-page { background: #0a0e27; color: #333; }
.page-heading h1 { color: #fff; }
.panel { background: #fff; border: 0; border-radius: 16px; }
.panel h2 { color: #0d1b3d; }
.panel-heading { border-bottom-color: #6c4b6a; }
.profile-fields { border-top-color: #eeeeee; }
.profile-fields strong { color: #0d1b3d; }
.password-form label { color: #0d1b3d; }
.password-form input { background: #fff; border-color: #e5e7eb; color: #0d1b3d; }
.button-primary { background: #f5b941; color: #0d1b3d; }
.page-heading .muted { color: #d1d5db; }
.profile-identity .muted { color: #6b7280; }
.resmanager-page { background: radial-gradient(circle at 88% 5%, rgba(108,92,231,.25), transparent 27rem), radial-gradient(circle at 4% 88%, rgba(74,222,128,.12), transparent 24rem), var(--ink); color: var(--text); }
.panel { background: rgba(18,23,63,.74); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: 0 18px 45px rgba(0,0,0,.18); padding: 29px; }
.profile-identity h2, .panel h2, .profile-fields strong { color: var(--text); }.profile-identity .muted, .password-form label { color: var(--text-muted); }
.avatar { background: linear-gradient(135deg, var(--gold), #f7d278); border: 4px solid rgba(255,255,255,.09); box-shadow: 0 8px 24px rgba(0,0,0,.22); height: 74px; width: 74px; }
.profile-fields { gap: 0; padding-top: 9px; }.profile-fields > div { border-bottom: 1px solid rgba(255,255,255,.08); padding: 15px 0; }.profile-fields > div:last-child { border-bottom: 0; padding-bottom: 0; }
.verified { align-items: center; display: flex !important; gap: 7px; }.verified::before { background: var(--mint); border-radius: 50%; content: ''; height: 7px; width: 7px; }
.panel-heading { border-bottom-color: rgba(255,255,255,.1); }.password-form input { background: rgba(10,14,39,.55); border-color: var(--glass-border); color: var(--text); }.password-form input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(232,181,77,.13); outline: 0; }
.form-error, .form-success { border-radius: 8px; padding: 10px 11px; }.form-error { background: rgba(255,133,119,.12); color: #ffaaa0; }.form-success { background: var(--mint-soft); }
.page-heading .button, .password-form .button { box-shadow: 0 8px 18px rgba(0,0,0,.16); transition: transform .2s ease, background .2s ease; }.page-heading .button:hover, .password-form .button:hover { background: #f4c764; transform: translateY(-1px); }
</style>
