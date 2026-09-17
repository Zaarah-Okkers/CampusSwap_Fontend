<template>
  <main class="marketplace-page">
    <div class="inner">
      <p class="eyebrow">Marketplace</p>
      <h1>Browse student listings</h1>

      <div v-if="searchQuery" class="search-banner glass-panel">
        <p>You searched for:</p>
        <h2>"{{ searchQuery }}"</h2>
        <p class="dim">Full marketplace filtering is coming soon. In the meantime, check the featured listings on the home page.</p>
      </div>

      <div v-else class="coming-soon glass-panel">
        <h2>Coming soon</h2>
        <p class="dim">The full marketplace page is under construction. Featured items are already visible on the home page.</p>
      </div>

      <router-link to="/" class="btn-gold">Back to Home</router-link>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = computed(() => route.query.q || '')
</script>

<style scoped>
.marketplace-page {
  width: 100%;
  min-height: 100vh;
  background: var(--ink);
  color: var(--text);
  padding: 40px 20px 160px;
  box-sizing: border-box;
}

.inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.eyebrow {
  color: var(--gold);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

h1 {
  font-size: clamp(26px, 4vw, 34px);
  margin: 0 0 40px;
}

.search-banner,
.coming-soon {
  border-radius: 14px;
  border: 1px solid var(--glass-border);
  padding: 32px 24px;
  margin-bottom: 32px;
}

.search-banner h2 {
  color: var(--gold);
  margin: 8px 0 16px;
}

.dim {
  color: var(--text-faint);
  font-size: 14px;
  line-height: 1.6;
}

.btn-gold {
  display: inline-block;
  background: var(--gold);
  color: var(--ink-elevated);
  font-weight: 700;
  padding: 11px 26px;
  border-radius: 9px;
  text-decoration: none;
}
</style>