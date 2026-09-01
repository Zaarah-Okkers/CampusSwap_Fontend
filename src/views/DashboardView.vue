<template>

  <div class="dashboard-page">
    <h2>Hi, no-name</h2>
    <p style="color: #64748B; margin-top: 0;">University of Cape Town</p>

    <div class="card">

      <h3>My Profile</h3>

      <div class="stats-grid">

        <div class="stat-card">
          <span class="stat-title">Seller Rating</span>
          <span class="stat-value" style="color: #2E7D5A;">4.9</span>
        </div>

        <div class="stat-card">
          <span class="stat-title">Active Listings</span>
          <span class="stat-value" style="color: #00A6A6;">3</span>
        </div>

        <div class="stat-card">
          <span class="stat-title">Saved Total</span>
          <span class="stat-value" style="color: #F5B941;">R1,200</span>
        </div>

      </div>
    </div>

    <div class="card">
      <h3>Account Management</h3>
      <div class="menu-item">
        <router-link to="/academic">Active Orders &gt;</router-link>
      </div>

      <div class="menu-item">
        <router-link to="/safehome">SafeHome Bookings &gt;</router-link>
      </div>

      <div class="menu-item">
        <router-link to="/checkout">Checkout &gt;</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card {
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-grid { 
  display: flex; 
  gap: 10px; 
}

.stat-card {
  width: 33.33%;
  background-color: #F4F6F8;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-title { 
  display: block; 
  font-size: 13px; 
  color: #64748B; 
}

.stat-value { 
  font-weight: bold; 
  font-size: 20px; 
}

.menu-item { 
  border-bottom: 1px solid #EEEEEE; 
  padding: 10px 0; 
}

.menu-item:last-child { 
  border-bottom: none; 
}
</style>