<script setup>
defineProps({
  type: {
    type: String,
    default: 'card' // 'card', 'list', 'grid', 'profile'
  },
  count: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="skeleton-wrapper">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" v-for="i in count" :key="i" class="skeleton-card">
      <div class="skeleton-image shimmer"></div>
      <div class="skeleton-content">
        <div class="skeleton-line shimmer" style="width: 80%"></div>
        <div class="skeleton-line shimmer" style="width: 60%"></div>
        <div class="skeleton-line shimmer" style="width: 40%"></div>
        <div class="skeleton-line shimmer" style="width: 70%"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-if="type === 'list'" v-for="i in count" :key="i" class="skeleton-list">
      <div class="skeleton-avatar shimmer"></div>
      <div class="skeleton-list-content">
        <div class="skeleton-line shimmer" style="width: 70%"></div>
        <div class="skeleton-line shimmer" style="width: 50%"></div>
      </div>
    </div>

    <!-- Grid Skeleton -->
    <div v-if="type === 'grid'" class="skeleton-grid">
      <div v-for="i in count" :key="i" class="skeleton-grid-item">
        <div class="skeleton-image shimmer"></div>
        <div class="skeleton-line shimmer" style="width: 80%"></div>
        <div class="skeleton-line shimmer" style="width: 60%"></div>
      </div>
    </div>

    <!-- Profile Skeleton -->
    <div v-if="type === 'profile'" class="skeleton-profile">
      <div class="skeleton-avatar large shimmer"></div>
      <div class="skeleton-line shimmer" style="width: 60%; margin: 12px auto;"></div>
      <div class="skeleton-line shimmer" style="width: 40%; margin: 0 auto;"></div>
      <div class="skeleton-divider"></div>
      <div class="skeleton-line shimmer" style="width: 100%"></div>
      <div class="skeleton-line shimmer" style="width: 90%"></div>
      <div class="skeleton-line shimmer" style="width: 80%"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  flex: 1;
  min-width: 200px;
  border: 1px solid var(--glass-border);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.05);
}

.skeleton-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.skeleton-list {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  flex: 1;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.skeleton-avatar.large {
  width: 80px;
  height: 80px;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
}

.skeleton-grid-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
}

.skeleton-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  flex: 1;
  gap: 8px;
}

.skeleton-divider {
  width: 100%;
  height: 1px;
  background: var(--glass-border);
  margin: 12px 0;
}

/* Shimmer Animation */
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>