<template>
  <div id="app">
    <TopBar v-if="showTopBar" />

    <div class="page-body">
      <router-view />
    </div>

    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from './components/TopBar.vue'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()

// topbar hidden only on login page
const showTopBar = computed(() => route.path !== '/login')

// bottom nav on every page
const showBottomNav = computed(() => true)
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
}
</style>