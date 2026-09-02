<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="product-card" @click="emit('select', product)">
    <div class="thumb">
      <img :src="product.image" :alt="product.name" />
      <span class="condition-badge" :class="product.conditionClass">
        {{ product.condition }}
      </span>
    </div>
    <div class="card-body">
      <h4>{{ product.name }}</h4>
      <div class="price-row">
        <span class="price">R{{ product.price }}</span>
      </div>
      <div class="rating">
        <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"/></svg>
        {{ product.rating }} ({{ product.sales }} Sales)
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.thumb {
  position: relative;
  height: 140px;
  background: #eee;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.condition-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  background: var(--badge-mint-bg);
  color: var(--badge-mint-text);
}

.condition-badge.fair {
  background: var(--badge-fair-bg);
  color: var(--badge-fair-text);
}

.card-body {
  padding: 12px;
}

.card-body h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--text-dark);
}

.price-row {
  margin-bottom: 6px;
}

.price {
  font-weight: 700;
  font-size: 15px;
  color: var(--price-green);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.star-icon {
  width: 13px;
  height: 13px;
  color: var(--accent-orange);
  flex-shrink: 0;
}
</style>