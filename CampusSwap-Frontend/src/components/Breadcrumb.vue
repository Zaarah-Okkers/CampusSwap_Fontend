<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Define breadcrumb mappings
const breadcrumbMap = {
  '/': 'Home',
  '/chat': 'Messages',
  '/admin': 'Admin Dashboard',
  '/books': 'BookSphere',
  '/profile': 'Profile',
  '/settings': 'Settings'
}

// Generate breadcrumbs from route path
const breadcrumbs = computed(() => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  const crumbs = []
  let currentPath = ''
  
  // Add home
  crumbs.push({
    name: 'Home',
    path: '/',
    isActive: path === '/'
  })
  
  // Build path segments
  for (const segment of segments) {
    currentPath += '/' + segment
    const displayName = breadcrumbMap[currentPath] || 
                       segment.charAt(0).toUpperCase() + segment.slice(1)
    crumbs.push({
      name: displayName,
      path: currentPath,
      isActive: path === currentPath
    })
  }
  
  return crumbs
})

// Navigate to breadcrumb
function navigateTo(path) {
  if (path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <button
          v-if="!crumb.isActive"
          class="breadcrumb-link"
          @click="navigateTo(crumb.path)"
        >
          {{ crumb.name }}
        </button>
        <span v-else class="breadcrumb-current">{{ crumb.name }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  padding: 12px 0 8px;
  font-size: 13px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-link {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 13px;
  font-family: inherit;
}

.breadcrumb-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.breadcrumb-current {
  color: var(--text);
  font-weight: 600;
  padding: 4px 8px;
}

.breadcrumb-separator {
  color: var(--text-faint);
  display: flex;
  align-items: center;
}

.breadcrumb-separator svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 640px) {
  .breadcrumb {
    font-size: 12px;
    padding: 8px 0 4px;
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    padding: 2px 6px;
  }
}
</style>