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
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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
      <span class="user-name">Myles N.</span>
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
  padding: 14px 24px;
}

.search-wrap {
  flex: 1;
  max-width: 420px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.search-wrap input {
  width: 100%;
  padding: 8px 14px 8px 36px;
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

.user-name {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .app-header {
    gap: 10px;
    padding: 8px 12px;
    flex-wrap: nowrap;
  }

  .search-wrap {
    max-width: none;
  }

  .search-wrap input {
    padding: 6px 10px 6px 30px;
    font-size: 13px;
  }

  .user-name {
    display: none;
  }

  .header-icons {
    gap: 10px;
  }
}
</style>