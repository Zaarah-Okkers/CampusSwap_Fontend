<template>
  <span class="app-icon" :aria-hidden="decorative" v-html="Icons[name] || Icons.info"></span>
</template>

<script setup>
import Icons from './Icon'

defineProps({
  name: { type: String, required: true },
  decorative: { type: Boolean, default: true }
})
</script>

<style scoped>
.app-icon { display: inline-flex; width: 1.1em; height: 1.1em; flex: 0 0 1.1em; color: currentColor; vertical-align: -0.15em; }
.app-icon :deep(svg) { display: block; height: 100%; width: 100%; color: currentColor; stroke: currentColor; }
</style>
