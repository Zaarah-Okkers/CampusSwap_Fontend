<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist, has been removed, or is temporarily unavailable.</p>
      <div class="actions">
        <router-link to="/" class="btn-primary">Return to Home</router-link>
        <button @click="$router.back()" class="btn-secondary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.not-found-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 5rem;
  font-weight: 900;
  color: #2e7d5a;
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.75rem;
  color: #0d1b3d;
  margin-bottom: 1rem;
}

p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #2e7d5a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #235f45;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}
</style>