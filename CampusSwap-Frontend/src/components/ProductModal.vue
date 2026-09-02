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
    <div class="modal-box">
      <button class="close-btn" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

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
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn svg {
  width: 14px;
  height: 14px;
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
  background: #4A7FE8;
}

.type-badge.swap {
  background: #8B5CF6;
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
  flex-wrap: wrap;
}

.price {
  font-weight: 700;
  font-size: 18px;
  color: var(--price-green);
}

.rent-period {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.swap-text {
  font-weight: 700;
  font-size: 16px;
  color: var(--price-green);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.star-icon {
  width: 13px;
  height: 13px;
  color: var(--accent-orange);
  flex-shrink: 0;
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
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding-top: 12px;
  padding-bottom: 16px;
  border-top: 1px solid var(--border-light);
}

.seller-label {
  color: var(--text-muted);
}

.seller-name {
  font-weight: 600;
  color: var(--text-dark);
}

.seller-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
  color: var(--text-muted);
}

.rate-section {
  border-top: 1px solid var(--border-light);
  padding-top: 16px;
}

.rate-block {
  margin-bottom: 14px;
}

.rate-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 6px;
}

.review-input,
.review-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-dark);
  font-family: inherit;
  resize: vertical;
}

.submit-rating-btn {
  width: 100%;
  background: var(--accent-orange);
  color: var(--navy);
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.submit-rating-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.thanks-msg {
  text-align: center;
  color: var(--accent-orange);
  font-weight: 600;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.reviews-section {
  border-top: 1px solid var(--border-light);
  padding-top: 16px;
  padding-bottom: 16px;
}

.review-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
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
  color: var(--text-dark);
}

.review-text {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}
</style>