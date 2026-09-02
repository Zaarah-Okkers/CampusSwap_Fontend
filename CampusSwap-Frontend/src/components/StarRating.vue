<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  size: { type: Number, default: 20 }
})
const emit = defineEmits(['update:modelValue'])

function setRating(val) {
  if (props.readonly) return
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="star-rating" :class="{ readonly }">
    <svg
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ filled: n <= modelValue }"
      viewBox="0 0 24 24"
      fill="currentColor"
      @click="setRating(n)"
    >
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"/>
    </svg>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  gap: 2px;
}

.star {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  color: var(--border-light);
  cursor: pointer;
  transition: color 0.15s ease;
}

.star.filled {
  color: var(--accent-orange);
}

.star-rating.readonly .star {
  cursor: default;
}
</style>