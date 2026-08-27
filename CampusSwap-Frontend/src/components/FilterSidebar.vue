<template>
  <aside class="filter-sidebar">
    <h3>Filters</h3>

    <div class="filter-group">
      <label>University</label>
      <select>
        <option>University of Cape Town (UCT)</option>
        <option>Wits</option>
        <option>Stellenbosch</option>
        <option>UKZN</option>
        <option>UP</option>
        <option>UJ</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Faculty</label>
      <select>
        <option>Science & Engineering</option>
        <option>Commerce</option>
        <option>Humanities</option>
        <option>Law</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Module Code</label>
      <select>
        <option>MAM / CSC</option>
        <option>ACCN200</option>
        <option>ENGL101</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Condition</label>
      <select>
        <option>Used - Like New</option>
        <option>New</option>
        <option>Fair</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Price Range</label>
      <select>
        <option>R200 - R2000</option>
        <option>Under R200</option>
        <option>R2000+</option>
      </select>
    </div>
  </aside>
</template>

<script setup lang="ts">
</script>

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