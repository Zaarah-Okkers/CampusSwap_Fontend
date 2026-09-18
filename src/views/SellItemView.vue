<template>
  <main class="sell-page">
    <div class="sell-intro"><p class="eyebrow">Student marketplace</p><h1>Sell an item</h1><p>List textbooks, tech, and room essentials for other students.</p><router-link to="/marketplace">Back to marketplace</router-link></div>
    <SellItemModal @close="router.push('/marketplace')" @submit="submitListing" />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'
import SellItemModal from '../components/SellItemModal.vue'

const router = useRouter()
const store = useStore()

// This mirrors the currently available Marketplace listings. A backend can
// replace this lookup later without changing the swap request flow.
const availableSwapTargets = [
  { id: 1, name: 'Organic Chemistry Lecture Notes', ownerId: 3, ownerName: 'Aisha K.' },
  { id: 2, name: 'Scientific Calculator', ownerId: 8, ownerName: 'Sipho D.' },
  { id: 3, name: 'Calculus Textbook', ownerId: 7, ownerName: 'Naledi S.' },
  { id: 4, name: 'LED Study Desk Lamp', ownerId: 2, ownerName: 'Thabo M.' },
  { id: 5, name: 'Mini Fridge for Residence', ownerId: 'lerato-m', ownerName: 'Lerato M.' },
  { id: 7, name: 'Dorm Storage Crates', ownerId: 'mia-d', ownerName: 'Mia D.' },
  { id: 10, name: 'Portable Clothes Rail', ownerId: 'amahle-r', ownerName: 'Amahle R.' },
  { id: 11, name: 'Compact Study Desk', ownerId: 'nandi-m', ownerName: 'Nandi M.' },
  { id: 12, name: 'Dorm Room Wall Prints Set', ownerId: 'jade-l', ownerName: 'Jade L.' },
  { id: 13, name: 'Bedside Storage Unit', ownerId: 'neo-t', ownerName: 'Neo T.' }
]

function findSwapTarget(query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(word => word.length > 2)
  return availableSwapTargets.find(item => {
    const name = item.name.toLowerCase()
    return name.includes(query.toLowerCase().trim()) || words.some(word => name.includes(word))
  })
}

async function submitListing(listing) {
  if (listing.listingType !== 'swap') {
    router.push('/marketplace')
    return
  }

  const target = findSwapTarget(listing.swapFor)
  if (!target) {
    await Swal.fire({
      icon: 'info',
      title: 'Item not available yet',
      text: 'We could not find that item in Marketplace. Try the listing name shown on an available card.',
      confirmButtonColor: '#f5b941'
    })
    return
  }

  const requester = store.getters['user/currentUser']
  store.dispatch('notifications/create', {
    userId: target.ownerId,
    type: 'swap_request',
    title: 'New swap request',
    message: `${requester?.name || listing.sellerName} wants to swap “${listing.name}” for your “${target.name}”.`,
    actionUrl: '/marketplace',
    metadata: { requestedItem: target.name, offeredItem: listing.name, requesterId: requester?.id }
  })

  await Swal.fire({
    icon: 'success',
    title: 'Swap request sent',
    text: `${target.ownerName} has been notified about your request for “${target.name}”.`,
    confirmButtonColor: '#2e7d5a'
  })
  router.push('/marketplace')
}
</script>

<style scoped>
.sell-page { min-height: 100vh; padding: 42px 24px; }.sell-intro { margin: 0 auto; max-width: 520px; }.eyebrow { color: var(--gold); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.sell-intro h1 { font-size: 2.6rem; margin: 6px 0; }.sell-intro p { color: var(--text-muted); }.sell-intro a { color: var(--gold); display: inline-block; font-weight: 700; margin-top: 10px; }
.sell-intro p { color: #d1d5db; }
</style>
