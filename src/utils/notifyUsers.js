// The manager-side mock data (ResManagerPayments.vue) only has resident
// *names* like "Lerato M.", while notifications are stored against a
// UserStore user id. This resolves a name to the closest matching mock
// user so notifications land on the right account when that resident is
// the one currently switched-to in the demo UserSwitch. Names with no
// match in the mock roster (e.g. "Lerato M.", "Kabelo P.") fall back to a
// stable synthetic id derived from the name, so a notification is still
// recorded — it just won't be visible until a matching mock user exists.
export function resolveResidentId(store, residentName) {
  const users = store.getters['user/users'] || []
  const firstName = residentName.trim().split(' ')[0].toLowerCase()
  const match = users.find(user => user.name.toLowerCase().startsWith(firstName))
  if (match) return match.id
  return `guest-${residentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

// Fixed mock ids from src/stores/UserStore.js — there is currently only
// one residence-manager account and one admin account in the demo data.
export const RESMANAGER_USER_ID = 9
export const ADMIN_USER_ID = 5