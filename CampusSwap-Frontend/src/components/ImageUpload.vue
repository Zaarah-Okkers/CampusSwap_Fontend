<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Upload Image'
  }
})

const emit = defineEmits(['update:modelValue'])

const imageUrl = ref(props.modelValue)
const isDragging = ref(false)
const fileInput = ref(null)

// Preview image URL
const previewUrl = ref(props.modelValue || '')

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  imageUrl.value = newVal
  previewUrl.value = newVal
})

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

// Handle drag and drop
function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDragOver(event) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

// Process the file - convert to base64 or upload
function processFile(file) {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, GIF, WEBP, or SVG)')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target.result
    previewUrl.value = dataUrl
    imageUrl.value = dataUrl
    emit('update:modelValue', dataUrl)
  }
  reader.readAsDataURL(file)
}

// Clear the image
function clearImage() {
  previewUrl.value = ''
  imageUrl.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Trigger file input
function triggerFileInput() {
  fileInput.value.click()
}
</script>

<template>
  <div class="image-upload">
    <label class="upload-label">{{ label }}</label>
    
    <div 
      class="upload-area"
      :class="{ dragging: isDragging, hasImage: previewUrl }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <template v-if="!previewUrl">
        <div class="upload-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18"/>
            <line x1="8" y1="2" x2="8" y2="22"/>
            <line x1="16" y1="2" x2="16" y2="22"/>
            <line x1="2" y1="8" x2="22" y2="8"/>
            <line x1="2" y1="16" x2="22" y2="16"/>
          </svg>
          <p>Click or drag to upload</p>
          <span>JPEG, PNG, GIF, WEBP (max 5MB)</span>
        </div>
      </template>
      
      <template v-else>
        <div class="image-preview">
          <img :src="previewUrl" alt="Preview" />
          <button class="remove-image" @click.stop="clearImage" aria-label="Remove image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </template>
    </div>
    
    <!-- URL input as fallback -->
    <div class="url-input-wrapper">
      <span class="url-label">Or paste image URL</span>
      <input 
        v-model="imageUrl"
        @input="emit('update:modelValue', imageUrl); previewUrl = imageUrl"
        type="text"
        placeholder="https://example.com/image.jpg"
        class="url-input"
      />
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.upload-area {
  border: 2px dashed var(--glass-border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--gold);
  background: rgba(232, 181, 77, 0.05);
}

.upload-area.dragging {
  border-color: var(--gold);
  background: rgba(232, 181, 77, 0.1);
  transform: scale(1.02);
}

.upload-area.hasImage {
  padding: 8px;
  min-height: auto;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-placeholder svg {
  width: 40px;
  height: 40px;
  color: var(--text-faint);
}

.upload-placeholder p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.upload-placeholder span {
  font-size: 12px;
  color: var(--text-faint);
}

.image-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.8);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image:hover {
  transform: scale(1.1);
  background: rgba(255, 0, 0, 1);
}

.remove-image svg {
  width: 14px;
  height: 14px;
}

.url-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.url-label {
  font-size: 12px;
  color: var(--text-faint);
}

.url-input {
  padding: 10px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.url-input:focus {
  outline: none;
  border-color: var(--gold);
}
</style>