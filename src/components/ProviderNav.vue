<template>
  <nav class="provider-nav glass-panel" aria-label="Service provider navigation">
    <router-link v-for="item in links" :key="item.to" :to="item.to" class="provider-nav-link">
      <span>{{ item.label }}</span>
      <small v-if="item.count !== undefined">{{ item.count }}</small>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const links = computed(() => [
  { label: 'Dashboard', to: '/provider-dashboard' },
  { label: 'Available Jobs', to: '/provider-jobs/available', count: store.getters['provider/availableJobs'].length },
  { label: 'My Jobs', to: '/provider-jobs' },
  { label: 'Reviews', to: '/provider-dashboard#reviews' },
  { label: 'Profile', to: '/provider-profile' }
])
</script>

<style scoped>
.provider-nav {
  display: flex;
  gap: 8px;
  padding: 8px;
  margin-bottom: 28px;
  overflow-x: auto;
  background: #0d1b3d;
  border: 0;
  border-radius: 12px;
}

.provider-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  color: #d1d5db;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.provider-nav-link:hover,
.provider-nav-link.router-link-active {
  background: rgba(245, 185, 65, 0.16);
  color: #f5b941;
}

.provider-nav-link small {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  text-align: center;
}
@media (max-width: 640px) {
  .provider-nav {
    flex-direction: column;
  }
  .provider-nav-link {
    width: 100%;
  }
}
</style>