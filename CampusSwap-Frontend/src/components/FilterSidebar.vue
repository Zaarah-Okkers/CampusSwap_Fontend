<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  }
})

defineEmits(['update:filters'])
</script>

<template>
  <aside class="filter-sidebar">
    <h3>Filters</h3>

    <div class="filter-group">
      <label>University</label>
      <select :value="filters.university" @change="$emit('update:filters', { ...filters, university: $event.target.value })">
        <option value="">All</option>
        <option>University of Cape Town (UCT)</option>
        <option>Wits</option>
        <option>Stellenbosch</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Condition</label>
      <select :value="filters.condition" @change="$emit('update:filters', { ...filters, condition: $event.target.value })">
        <option value="">All</option>
        <option>Used: Like New</option>
        <option>Like New</option>
        <option>Fair Condition</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Max Price</label>
      <select :value="filters.maxPrice" @change="$emit('update:filters', { ...filters, maxPrice: Number($event.target.value) })">
        <option value="5000">Any</option>
        <option value="500">Under R500</option>
        <option value="2000">Under R2000</option>
      </select>
    </div>
  </aside>
</template>

<style scoped>
.filter-sidebar {
  background: var(--card-white);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 20px;
  width: 220px;
  height: fit-content;
}

.filter-sidebar h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: var(--text-dark);
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.filter-group select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 13px;
  background: white;
  color: var(--text-dark);
}
</style>