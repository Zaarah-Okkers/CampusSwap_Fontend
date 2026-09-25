<template>
  <main class="sell-page">
    <div class="sell-intro"><p class="eyebrow">Student marketplace</p><h1>Sell an item</h1><p>List textbooks, tech, and room essentials for other students.</p><router-link to="/marketplace">Back to marketplace</router-link></div>
    <SellItemModal @close="router.push('/marketplace')" @submit="submitListing" />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
// Swap flow isn't backed by the backend yet. Posting as a normal listing
// (the modal already calls POST /api/products) and closing the page.
async function submitListing(listing) {
  router.push('/marketplace')
}
</script>

<style scoped>
.sell-page { min-height: 100vh; padding: 42px 24px; }.sell-intro { margin: 0 auto; max-width: 520px; }.eyebrow { color: var(--gold); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.sell-intro h1 { font-size: 2.6rem; margin: 6px 0; }.sell-intro p { color: var(--text-muted); }.sell-intro a { color: var(--gold); display: inline-block; font-weight: 700; margin-top: 10px; }
.sell-intro p { color: #d1d5db; }
</style>
