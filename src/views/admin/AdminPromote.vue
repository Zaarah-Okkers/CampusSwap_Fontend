<template>
  <div class="admin-promote">
    <div class="page-header">
      <h2>🚀 Promote Content</h2>
      <p>Boost visibility for premium users</p>
    </div>

    <div class="promote-grid">
      <div class="promote-card glass-panel">
        <div class="promote-icon">📈</div>
        <h3>Featured Listings</h3>
        <p>Feature premium users' listings on the homepage</p>
        <button class="promote-btn" @click="featuredListings = !featuredListings">
          {{ featuredListings ? '✅ Enabled' : 'Enable' }}
        </button>
      </div>

      <div class="promote-card glass-panel">
        <div class="promote-icon">🎯</div>
        <h3>Targeted Promotion</h3>
        <p>Show premium content to relevant users</p>
        <button class="promote-btn" @click="targetedPromotion = !targetedPromotion">
          {{ targetedPromotion ? '✅ Enabled' : 'Enable' }}
        </button>
      </div>

      <div class="promote-card glass-panel">
        <div class="promote-icon">⭐</div>
        <h3>Premium Badge</h3>
        <p>Display premium badge on user profiles</p>
        <button class="promote-btn" @click="premiumBadge = !premiumBadge">
          {{ premiumBadge ? '✅ Enabled' : 'Enable' }}
        </button>
      </div>

      <div class="promote-card glass-panel">
        <div class="promote-icon">📣</div>
        <h3>Newsletter Promotion</h3>
        <p>Include premium listings in newsletters</p>
        <button class="promote-btn" @click="newsletterPromotion = !newsletterPromotion">
          {{ newsletterPromotion ? '✅ Enabled' : 'Enable' }}
        </button>
      </div>
    </div>

    <div class="promote-list">
      <h3>Current Promotions</h3>
      <div v-for="promo in promotions" :key="promo.id" class="promo-item glass-panel">
        <div class="promo-info">
          <span class="promo-title">{{ promo.title }}</span>
          <span class="promo-user">{{ promo.user }}</span>
          <span class="promo-date">{{ promo.date }}</span>
        </div>
        <span class="promo-status" :class="promo.status">{{ promo.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuredListings = ref(true)
const targetedPromotion = ref(false)
const premiumBadge = ref(true)
const newsletterPromotion = ref(false)

const promotions = ref([
  { id: 1, title: 'HP EliteBook 840 G5', user: 'Thabo M.', date: '2024-01-15', status: 'active' },
  { id: 2, title: 'University Physics Book', user: 'Aisha K.', date: '2024-01-14', status: 'pending' },
  { id: 3, title: 'Sony ANC Headphones', user: 'Naledi S.', date: '2024-01-13', status: 'active' },
])
</script>

<style scoped>
.admin-promote {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 24px;
}

h2 {
  color: var(--text);
  margin: 0;
}

.page-header p {
  color: var(--text-muted);
  margin: 4px 0 0;
}

.promote-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.promote-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  text-align: center;
}

.promote-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.promote-card h3 {
  color: var(--text);
  margin: 0 0 8px;
}

.promote-card p {
  color: var(--text-muted);
  font-size: 13px;
  margin: 0 0 16px;
}

.promote-btn {
  padding: 8px 24px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.promote-btn:hover {
  background: rgba(255,255,255,0.1);
}

.promote-list {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 20px;
}

.promote-list h3 {
  color: var(--text);
  margin: 0 0 16px;
}

.promo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--glass-border);
  margin-bottom: 8px;
}

.promo-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.promo-title {
  font-weight: 600;
  color: var(--text);
}

.promo-user {
  color: var(--text-muted);
  font-size: 13px;
}

.promo-date {
  color: var(--text-faint);
  font-size: 12px;
}

.promo-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.promo-status.active {
  background: rgba(74, 222, 128, 0.2);
  color: var(--mint);
}

.promo-status.pending {
  background: rgba(232, 181, 77, 0.2);
  color: var(--gold);
}
</style>
