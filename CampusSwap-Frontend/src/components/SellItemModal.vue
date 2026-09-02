<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const form = ref({
  listingType: 'sell',
  name: '',
  price: null,
  rentPeriod: 'day',
  swapFor: '',
  condition: 'Like New',
  image: '',
  description: '',
  sellerName: ''
})

function handleSubmit() {
  if (!form.value.name || !form.value.sellerName) return
  if (form.value.listingType === 'sell' && !form.value.price) return
  if (form.value.listingType === 'rent' && !form.value.price) return
  if (form.value.listingType === 'swap' && !form.value.swapFor) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box">
      <button class="close-btn" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <h3>List an Item</h3>

      <div class="type-toggle">
        <button
          type="button"
          :class="{ active: form.listingType === 'sell' }"
          @click="form.listingType = 'sell'"
        >Sell</button>
        <button
          type="button"
          :class="{ active: form.listingType === 'rent' }"
          @click="form.listingType = 'rent'"
        >Rent</button>
        <button
          type="button"
          :class="{ active: form.listingType === 'swap' }"
          @click="form.listingType = 'swap'"
        >Swap</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <label>Item Name</label>
        <input v-model="form.name" type="text" placeholder="e.g. Casio Calculator FX-991" required />

        <template v-if="form.listingType === 'sell'">
          <label>Price (R)</label>
          <input v-model.number="form.price" type="number" min="0" placeholder="e.g. 250" required />
        </template>

        <template v-else-if="form.listingType === 'rent'">
          <label>Rental Price (R)</label>
          <input v-model.number="form.price" type="number" min="0" placeholder="e.g. 50" required />
          <label>Per</label>
          <select v-model="form.rentPeriod">
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="semester">Semester</option>
          </select>
        </template>

        <template v-else-if="form.listingType === 'swap'">
          <label>Looking to swap for</label>
          <input v-model="form.swapFor" type="text" placeholder="e.g. Organic Chemistry textbook" required />
        </template>

        <label>Condition</label>
        <select v-model="form.condition">
          <option>Used: Like New</option>
          <option>Like New</option>
          <option>Fair Condition</option>
        </select>

        <label>Photo URL</label>
        <input v-model="form.image" type="text" placeholder="Paste an image link (optional)" />

        <label>Description</label>
        <textarea v-model="form.description" rows="4" placeholder="Describe the item's condition, what's included, etc."></textarea>

        <label>Your Name</label>
        <input v-model="form.sellerName" type="text" placeholder="e.g. Zaarah K." required />

        <button type="submit" class="submit-btn">List Item</button>
      </form>
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
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 24px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.08);
  color: var(--text-dark);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

h3 {
  margin: 0 0 16px;
  font-size: 19px;
  color: var(--text-dark);
}

.type-toggle {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.type-toggle button {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-light);
  background: white;
  color: var(--text-muted);
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.type-toggle button.active {
  background: var(--accent-orange);
  border-color: var(--accent-orange);
  color: var(--navy);
}

form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 10px;
}

input,
select,
textarea {
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-dark);
  font-family: inherit;
  resize: vertical;
}

.submit-btn {
  margin-top: 20px;
  background: var(--accent-orange);
  color: var(--navy);
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
</style>