<!-- just made it more responsive -->

<template>
  <section class="product-grid-section">
    <div class="hero glass-panel">
      <span class="hero-eyebrow">South Africa's student marketplace</span>
      <h2>Buy, swap &amp; rent your way through campus</h2>
      <p class="hero-sub">
        Textbooks, tech and room essentials, traded safely between students.
      </p>
    </div>

    <CategoryPills
      :model-value="category"
      @update:model-value="emit('update:category', $event)"
    />

    <div class="grid-header">
      <p class="subtitle">
        {{ products.length }} listing{{ products.length === 1 ? "" : "s" }}
      </p>
    </div>

    <div v-if="products.length" class="product-grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        :saved="savedIds.has(p.id)"
        @select="handleCardSelect"
        @toggle-save="emit('toggle-save', $event)"
      />
    </div>
    <div v-else class="empty glass-panel">
      <p class="empty-title">Nothing matches yet</p>
      <p class="empty-sub">Try a different category or clear your filters.</p>
    </div>

    <button class="fab" @click="emit('open-sell')" aria-label="Sell an item">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import CategoryPills from "./CategoryPills.vue";

defineProps({
  products: { type: Array, required: true },
  category: { type: String, default: "all" },
  savedIds: { type: Set, default: () => new Set() },
});

const emit = defineEmits([
  "select",
  "open-sell",
  "update:category",
  "toggle-save",
]);

function handleCardSelect(product) {
  emit("select", product);
}
</script>

<style scoped>
.product-grid-section {
  flex: 1;
  width: 100%;
  padding: 16px 0 120px;
  margin-top: 0;
  box-sizing: border-box;
}

.hero {
  border-radius: 22px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background: var(--ink-elevated, #171d4c);
}

.hero-eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #e8b54d;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero h2 {
  font-size: 28px;
  line-height: 1.2;
  margin: 0 0 10px;
  color: #f4f2ff;
}

.hero-sub {
  font-size: 15px;
  color: rgba(244, 242, 255, 0.62);
  max-width: 40ch;
  margin: 0;
}

.grid-header {
  margin: 20px 0 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: rgba(244, 242, 255, 0.4);
  font-weight: 600;
}

/* Fluid responsive grid — every viewport size gets the right column count. */
.product-grid {
  display: grid;
  gap: 16px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.empty {
  border-radius: 18px;
  padding: 60px 20px;
  text-align: center;
}

.empty-title {
  font-family: "Fraunces", serif;
  font-size: 20px;
  margin: 0 0 8px;
  color: #f4f2ff;
}

.empty-sub {
  font-size: 14px;
  color: rgba(244, 242, 255, 0.62);
  margin: 0;
}

.fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e8b54d;
  color: #0a0e27;
  border: none;
  box-shadow: 0 10px 28px rgba(232, 181, 77, 0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 45;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: 0 14px 36px rgba(232, 181, 77, 0.5);
}

.fab:active {
  transform: scale(0.95);
}

.fab svg {
  width: 24px;
  height: 24px;
}

/* Fine-tuning by size — same pattern, but the fluid grid above already
   handles all widths without hard breakpoints. The rules below only
   control spacing and card min-width for readability. */
@media (min-width: 1400px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 20px 16px;
  }
  .hero h2 {
    font-size: 22px;
  }
  .product-grid-section {
    padding: 12px 0 100px;
  }
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .fab {
    right: 20px;
    bottom: 90px;
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 380px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
}
</style>
