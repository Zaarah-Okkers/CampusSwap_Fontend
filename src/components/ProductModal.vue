<script setup>
import { ref, watch } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'submit-review'])

const productRatingInput = ref(0)
const sellerRatingInput = ref(0)
const reviewerName = ref('')
const reviewText = ref('')
const submitted = ref(false)

watch(() => props.product, () => {
  productRatingInput.value = 0
  sellerRatingInput.value = 0
  reviewerName.value = ''
  reviewText.value = ''
  submitted.value = false
})

function submitReview() {
  if (productRatingInput.value === 0 && sellerRatingInput.value === 0) return
  emit('submit-review', {
    id: props.product.id,
    productRating: productRatingInput.value,
    sellerRating: sellerRatingInput.value,
    reviewerName: reviewerName.value || 'Anonymous',
    comment: reviewText.value
  })
  submitted.value = true
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box glass-panel">
      <div class="modal-header">
        <div class="drag-handle"></div>
        <button class="close-btn" @click="emit('close')" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-image">
        <img :src="product.image" :alt="product.name" />
        <span class="condition-badge" :class="product.conditionClass">
          {{ product.condition }}
        </span>
        <span v-if="product.listingType === 'rent'" class="type-badge rent">For Rent</span>
        <span v-else-if="product.listingType === 'swap'" class="type-badge swap">For Swap</span>
      </div>

      <div class="modal-body">
        <h3>{{ product.name }}</h3>
        <div class="price-row">
          <span v-if="product.listingType === 'swap'" class="price swap-text">Swap for: {{ product.swapFor }}</span>
          <span v-else class="price">
            R{{ product.price }}<span v-if="product.listingType === 'rent'" class="rent-period">/{{ product.rentPeriod }}</span>
          </span>
          <span class="rating">
            <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"/></svg>
            {{ product.rating }} ({{ product.sales }} Sales)
          </span>
        </div>

        <p class="university">{{ product.university }}</p>

        <h4 class="desc-heading">Description</h4>
        <p class="description">{{ product.description }}</p>

        <div class="seller-row" v-if="product.sellerName">
          <span class="seller-label">Sold by</span>
          <span class="seller-name">{{ product.sellerName }}</span>
          <span class="seller-rating" v-if="product.sellerRating">
            <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"/></svg>
            {{ product.sellerRating.toFixed(1) }}
          </span>
        </div>

        <button class="message-seller-btn">Message seller</button>

        <div class="rate-section" v-if="!submitted">
          <h4 class="desc-heading">Leave Feedback</h4>
          <div class="rate-block">
            <p class="rate-label">Rate this item</p>
            <StarRating v-model="productRatingInput" :size="22" />
          </div>
          <div class="rate-block">
            <p class="rate-label">Rate the seller</p>
            <StarRating v-model="sellerRatingInput" :size="22" />
          </div>
          <div class="rate-block">
            <p class="rate-label">Your name</p>
            <input v-model="reviewerName" type="text" placeholder="e.g. Zaarah K." class="review-input" />
          </div>
          <div class="rate-block">
            <p class="rate-label">Write a review (optional)</p>
            <textarea v-model="reviewText" rows="3" placeholder="What did you think of this item or the seller?" class="review-textarea"></textarea>
          </div>
          <button
            class="submit-rating-btn"
            :disabled="productRatingInput === 0 && sellerRatingInput === 0"
            @click="submitReview"
          >
            Submit Feedback
          </button>
        </div>
        <p v-else class="thanks-msg">Thanks for your feedback!</p>

        <div class="reviews-section" v-if="product.reviews && product.reviews.length">
          <h4 class="desc-heading">Reviews ({{ product.reviews.length }})</h4>
          <div class="review-item" v-for="(r, i) in product.reviews" :key="i">
            <div class="review-head">
              <span class="review-name">{{ r.reviewerName }}</span>
              <StarRating :model-value="r.productRating" readonly :size="14" />
            </div>
            <p class="review-text" v-if="r.comment">{{ r.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: var(--ink-elevated);
  border-radius: 24px;
  max-width: 640px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slide-up 0.3s ease;
  border: 1px solid var(--glass-border);
}

@keyframes slide-up {
  from { transform: translateY(30px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-header {
  position: sticky;
  top: 0;
  background: var(--ink-elevated);
  padding: 12px 20px 0;
  z-index: 2;
  border-radius: 24px 24px 0 0;
}

.drag-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--glass-border);
  margin: 0 auto 6px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10, 14, 39, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

.modal-image {
  position: relative;
  aspect-ratio: 4 / 3;
  max-height: 50vh;
  background: rgba(255, 255, 255, 0.04);
  margin: 0 16px;
  border-radius: 16px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.condition-badge {
  position: absolute;
  top: 12px;
  right: 12px;
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

.type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  color: white;
}

.type-badge.rent {
  background: var(--sky);
  color: var(--ink);
}

.type-badge.swap {
  background: var(--violet);
}

.modal-body {
  padding: 20px 24px 24px;
}

.modal-body h3 {
  margin: 0 0 10px;
  font-size: 22px;
  color: var(--text);
}

.price-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.price {
  font-weight: 700;
  font-size: 20px;
  color: var(--mint);
}

.rent-period {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.swap-text {
  font-weight: 700;
  font-size: 18px;
  color: var(--gold);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.star-icon {
  width: 14px;
  height: 14px;
  color: var(--gold);
  flex-shrink: 0;
}

.university {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.desc-heading {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-faint);
  margin: 0 0 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.seller-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 1px solid var(--glass-border);
}

.seller-label {
  color: var(--text-muted);
}

.seller-name {
  font-weight: 600;
  color: var(--text);
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
  color: var(--text-muted);
}

.message-seller-btn {
  width: 100%;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  color: var(--text);
  border-radius: 12px;
  padding: 13px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 18px;
  transition: all 0.2s ease;
}

.message-seller-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.rate-section {
  border-top: 1px solid var(--glass-border);
  padding-top: 16px;
}

.rate-block {
  margin-bottom: 14px;
}

.rate-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 6px;
}

.review-input,
.review-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.review-input:focus,
.review-textarea:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

.submit-rating-btn {
  width: 100%;
  background: var(--gold);
  color: var(--ink);
  border: none;
  border-radius: 12px;
  padding: 13px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-rating-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

.submit-rating-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.thanks-msg {
  text-align: center;
  color: var(--gold);
  font-weight: 600;
  padding-top: 16px;
  border-top: 1px solid var(--glass-border);
}

.reviews-section {
  border-top: 1px solid var(--glass-border);
  padding-top: 16px;
  padding-bottom: 8px;
}

.review-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--glass-border);
}

.review-item:last-child {
  border-bottom: none;
}

.review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.review-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.review-text {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .modal-box {
    width: 100%;
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
    bottom: 0;
    position: absolute;
    animation: slide-up-mobile 0.3s ease;
  }
  
  @keyframes slide-up-mobile {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .modal-overlay {
    align-items: flex-end;
  }
  
  .modal-image {
    margin: 0 12px;
    aspect-ratio: 4 / 3;
  }
  
  .modal-body {
    padding: 16px 16px 20px;
  }
  
  .modal-body h3 {
    font-size: 19px;
  }
  
  .price {
    font-size: 17px;
  }
}

@media (min-width: 641px) {
  .modal-box {
    max-width: 640px;
  }
}
</style>