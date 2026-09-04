<template> 
<!-- RouterView dynamically renders whichever page component matches the current URL -->
  <main class="main-content">
    <RouterView />
  </main>
</template>
 


<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
main-content {
  min-height: 100vh;
  width: 100%;
}
</style>