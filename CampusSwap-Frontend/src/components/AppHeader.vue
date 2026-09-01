<script setup>
defineProps({
  search: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:search'])
</script>

<template>
  <header class="app-header">


    <div class="search-wrap">
      <input
        type="text"
        placeholder="Search textbooks, tech, rooms, tutors..."
        :value="search"
        @input="emit('update:search', $event.target.value)"
      />
    </div>

    <div class="header-icons">
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      </span>
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </span>
      <span class="avatar">MN</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--navy);
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.logo-badge {
  height: 44px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
}

.search-wrap {
  flex: 1;
  max-width: 420px;
}

.search-wrap input {
  width: 100%;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 14px;
}

.search-wrap input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.icon {
  cursor: pointer;
  display: inline-flex;
  color: rgba(255, 255, 255, 0.85);
}

.icon svg {
  width: 20px;
  height: 20px;
}

.icon:hover {
  color: var(--accent-orange);
}

.avatar {
  background: var(--accent-orange);
  color: var(--navy);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>