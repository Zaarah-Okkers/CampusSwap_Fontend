<script setup>
import { ref } from 'vue'
import ImageUpload from './ImageUpload.vue'

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
    <div class="modal-box glass-panel">
      <div class="modal-header">
        <div class="drag-handle"></div>
        <button class="close-btn" @click="emit('close')" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-body">
        <h3>List an item</h3>

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
          <div class="form-group">
            <label>Item name</label>
            <input v-model="form.name" type="text" placeholder="e.g. Casio Calculator FX-991" required />
          </div>

          <template v-if="form.listingType === 'sell'">
            <div class="form-group">
              <label>Price (R)</label>
              <input v-model.number="form.price" type="number" min="0" placeholder="e.g. 250" required />
            </div>
          </template>

          <template v-else-if="form.listingType === 'rent'">
            <div class="form-group">
              <label>Rental price (R)</label>
              <input v-model.number="form.price" type="number" min="0" placeholder="e.g. 50" required />
            </div>
            <div class="form-group">
              <label>Per</label>
              <select v-model="form.rentPeriod">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="semester">Semester</option>
              </select>
            </div>
          </template>

          <template v-else-if="form.listingType === 'swap'">
            <div class="form-group">
              <label>Looking to swap for</label>
              <input v-model="form.swapFor" type="text" placeholder="e.g. Organic Chemistry textbook" required />
            </div>
          </template>

          <div class="form-group">
            <label>Condition</label>
            <select v-model="form.condition">
              <option>Used: Like New</option>
              <option>Like New</option>
              <option>Fair Condition</option>
            </select>
          </div>

          <div class="form-group">
            <ImageUpload v-model="form.image" label="Product Image" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Describe the item's condition, what's included, etc."></textarea>
          </div>

          <div class="form-group">
            <label>Your name</label>
            <input v-model="form.sellerName" type="text" placeholder="e.g. Zaarah K." required />
          </div>

          <button type="submit" class="submit-btn">List item</button>
        </form>
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
  max-width: 520px;
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

.modal-body {
  padding: 0 24px 24px;
}

.modal-body h3 {
  margin: 0 0 18px;
  font-size: 22px;
  color: var(--text);
  font-family: 'Fraunces', serif;
}

.type-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.type-toggle button {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass);
  color: var(--text-muted);
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-toggle button:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.type-toggle button.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

input,
select,
textarea {
  padding: 11px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

select option {
  background: var(--ink-elevated);
  color: var(--text);
}

.submit-btn {
  margin-top: 8px;
  background: var(--gold);
  color: var(--ink);
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(232, 181, 77, 0.3);
}

.submit-btn:active {
  transform: scale(0.98);
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
  
  .modal-body {
    padding: 0 16px 20px;
  }
  
  .modal-body h3 {
    font-size: 19px;
  }
  
  .type-toggle button {
    font-size: 13px;
    padding: 10px;
  }
}

@media (min-width: 641px) {
  .modal-box {
    max-width: 520px;
  }
}
</style>