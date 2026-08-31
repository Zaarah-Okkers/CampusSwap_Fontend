<template>
  <div id="app">
    <CheckoutView />
  </div>
</template>

<script>
import CheckoutView from './components/CheckoutView.vue';

export default {
  name: 'App',
  components: {
    CheckoutView
  }
};
</script>

<style>
/* Reset base margins */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
}
</style>
