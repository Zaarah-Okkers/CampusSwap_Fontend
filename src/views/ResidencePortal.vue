<template>
  <StudentResidence v-if="isStudent" />
  <ResManagerPayments v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import StudentResidence from './StudentResidence.vue'
import ResManagerPayments from './ResManagerPayments.vue'

const store = useStore()
const isStudent = computed(() => store.getters['user/currentUser']?.role === 'student')
</script>
