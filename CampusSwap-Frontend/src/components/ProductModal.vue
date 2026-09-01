<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box">
      <button class="close-btn" @click="emit('close')">✕</button>

      <div class="modal-image">
        <img :src="product.image" :alt="product.name" />
        <span class="condition-badge" :class="product.conditionClass">
          {{ product.condition }}
        </span>
      </div>

      <div class="modal-body">
        <h3>{{ product.name }}</h3>
        <div class="price-row">
          <span class="price">R{{ product.price }}</span>
          <span class="rating">⭐ {{ product.rating }} ({{ product.sales }} Sales)</span>
        </div>

        <p class="university">{{ product.university }}</p>

        <h4 class="desc-heading">Description</h4>
        <p class="description">{{ product.description }}</p>

        <div class="seller-row" v-if="product.sellerName">
          <span class="seller-label">Sold by</span>
          <span class="seller-name">{{ product.sellerName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 27, 56, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal-box {
  background: var(--card-white);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
  z-index: 2;
}

.modal-image {
  position: relative;
  height: 220px;
  background: #eee;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.condition-badge {
  position: absolute;
  top: 12px;
  left: 12px;
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

.modal-body {
  padding: 20px;
}

.modal-body h3 {
  margin: 0 0 10px;
  font-size: 19px;
  color: var(--text-dark);
}

.price-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}

.price {
  font-weight: 700;
  font-size: 18px;
  color: var(--price-green);
}

.rating {
  font-size: 13px;
  color: var(--text-muted);
}

.university {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.desc-heading {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  margin: 0 0 6px;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-dark);
  margin: 0 0 16px;
}

.seller-row {
  display: flex;
  gap: 6px;
  font-size: 13px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.seller-label {
  color: var(--text-muted);
}

.seller-name {
  font-weight: 600;
  color: var(--text-dark);
}
</style>