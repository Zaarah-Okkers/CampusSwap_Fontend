<template>
  <div
    class="product-card glass-panel"
    role="button"
    tabindex="0"
    @click="onCardClick"
    @keyup.enter="onCardClick"
  >
    <div class="card-image">
      <img :src="product.image" :alt="product.name" loading="lazy" />

      <span class="condition-badge" :class="product.conditionClass">
        {{ product.condition }}
      </span>

      <span v-if="product.listingType === 'rent'" class="type-badge rent"
        >Rent</span
      >
      <span v-else-if="product.listingType === 'swap'" class="type-badge swap"
        >Swap</span
      >

      <button
        class="save-btn"
        :class="{ active: saved }"
        @click.stop="onSaveClick"
        aria-label="Save item"
      >
        <svg
          viewBox="0 0 24 24"
          :fill="saved ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 20.3l8.8-8.8c1.9-1.9 1.9-5 0-6.9z"
          />
        </svg>
      </button>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ product.name }}</h3>

      <p class="card-university">{{ product.university }}</p>

      <div class="card-footer">
        <span
          v-if="product.listingType === 'swap'"
          class="card-price swap-text"
        >
          Swap
        </span>
        <span v-else class="card-price">
          R{{ product.price
          }}<span v-if="product.listingType === 'rent'" class="rent-period">
            /{{ product.rentPeriod }}</span
          >
        </span>

        <span class="card-rating">
          <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"
            />
          </svg>
          {{ product.rating || "New" }}
        </span>
      </div>

      <span class="view-hint">View details →</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  saved: { type: Boolean, default: false },
});

const emit = defineEmits(["select", "toggle-save"]);

function onCardClick() {
  emit("select", props.product);
}

function onSaveClick() {
  emit("toggle-save", props.product.id);
}
</script>

<style scoped>
.product-card {
  border-radius: 20px;
  overflow: visible;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0;
  box-shadow: 0 10px 28px rgba(5, 7, 20, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  background: var(--glass, rgba(255, 255, 255, 0.055));
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(5, 7, 20, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.product-card:active {
  transform: scale(0.97) translateY(0);
}

.product-card:focus-visible {
  outline: 3px solid var(--gold, #e8b54d);
  outline-offset: 3px;
}

/* Visible "View details" hint that appears on hover */
.view-hint {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--gold, #e8b54d);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity 0.2s ease,
    max-height 0.2s ease,
    margin-top 0.2s ease;
  margin-top: 0;
}
.product-card:hover .view-hint {
  opacity: 1;
  max-height: 20px;
  margin-top: 8px;
}

.card-image {
  position: relative;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(5, 7, 20, 0.3);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.product-card:hover .card-image img {
  transform: scale(1.03);
}

.condition-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.9);
  color: #072614;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.condition-badge.fair {
  background: rgba(232, 181, 77, 0.92);
  color: #261a03;
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.type-badge.rent {
  background: #6fa8ff;
  color: #0a0e27;
}

.type-badge.swap {
  background: #6c5ce7;
}

.save-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(10, 14, 39, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.save-btn:hover {
  background: rgba(10, 14, 39, 0.8);
  transform: scale(1.1);
}

.save-btn svg {
  width: 16px;
  height: 16px;
}

.save-btn.active {
  color: #e8b54d;
  background: rgba(232, 181, 77, 0.2);
  border-color: #e8b54d;
}

.card-body {
  padding: 10px 4px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #f4f2ff;
  margin: 0 0 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-university {
  font-size: 11.5px;
  color: rgba(244, 242, 255, 0.5);
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.card-price {
  font-weight: 700;
  font-size: 15px;
  color: #4ade80;
}

.rent-period {
  font-size: 11px;
  font-weight: 600;
  color: rgba(244, 242, 255, 0.62);
}

.swap-text {
  color: #e8b54d;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: rgba(244, 242, 255, 0.62);
  flex-shrink: 0;
}

.star-icon {
  width: 12px;
  height: 12px;
  color: #e8b54d;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .product-card {
    padding: 8px 8px 0;
    border-radius: 16px;
  }
  .card-title {
    font-size: 12.5px;
  }
  .card-price {
    font-size: 13px;
  }
  .card-body {
    padding: 8px 2px 10px;
  }
  .view-hint {
    display: none;
  }
}
</style>
