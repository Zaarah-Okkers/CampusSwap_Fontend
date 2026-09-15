<template>
  <div id="app">
    <!-- Show Checkout View if activeView is 'checkout' -->
    <CheckoutView 
      v-if="currentView === 'checkout'" 
      @go-home="currentView = 'home'" 
    />

    <!-- Show Home / Main View otherwise -->
    <div v-else class="home-container">
      <h1>CampusSwap SA Home</h1>
      <p>Welcome to the campus marketplace!</p>
      
      <button class="btn-primary" @click="currentView = 'checkout'">
        Go to Checkout / Cart 🛒
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CheckoutView from './components/CheckoutView.vue';

// Active view state
const currentView = ref('checkout');
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
}

.home-container {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  padding: 20px;
}

.btn-primary {
  padding: 12px 24px;
  background-color: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}
</style>