<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero">
      <h1>One Campus. Endless Possibilities.</h1>
      <p>Buy, sell & rent textbooks. Book vetted handymen for your repairs.</p>

      <div class="hero-buttons">
        <button class="btn btn-primary" @click="$router.push('/academic')">Browse Academic Marketplace</button>
        <button class="btn btn-secondary" @click="$router.push('/safehome')">Book SafeHome Repairs</button>
      </div>
    </div>

    <!-- Core Services -->
    <div class="page-container section">
      <h2>Core Student Services</h2>
      <div class="service-cards">
        <div class="service-card" @click="$router.push('/academic')">
          <div class="icon" style="background-color: #2E7D5A;">M</div>
          <h3>Marketplace</h3>
          <p>Buy & Rent Tech</p>
        </div>
        <div class="service-card" @click="$router.push('/safehome')">
          <div class="icon" style="background-color: #6C4B86;">SH</div>
          <h3>SafeHome</h3>
          <p>Plumbing & Clean</p>
        </div>
      </div>
    </div>

    <!-- How CampusSwap Works -->
    <div class="page-container section how-to-use">
      <h2>How CampusSwap Works</h2>
      <div class="steps">
        <div class="step">
          <span class="step-num" style="background-color: #0D1B3D;">1</span>
          <div>
            <h3>Verify Your Profile</h3>
            <p>Sign up with your SA university email to ensure safe trading.</p>
          </div>
        </div>
        <div class="step">
          <span class="step-num" style="background-color: #6C4B86;">2</span>
          <div>
            <h3>Buy, Sell or Book</h3>
            <p>List textbooks or book vetted handymen for safe, secure repairs.</p>
          </div>
        </div>
        <div class="step">
          <span class="step-num" style="background-color: #2E7D5A;">3</span>
          <div>
            <h3>Secure Escrow</h3>
            <p>Payments are held securely in escrow until you receive your item.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero {
  background-color: #0D1B3D;
  color: white;
  padding: 60px;
  border-radius: 16px;
  margin-bottom: 40px;
}

.hero h1 { 
  font-size: 40px; 
}

.hero-buttons { 
  max-width: 400px; 
}

.btn-secondary { 
  margin-top: 10px; 
}


.section { 
  padding: 40px 0; 
}

.service-cards { 
  display: flex; 
  gap: 20px; 
}

.service-card {
  width: 50%;
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.service-card h3 { 
  margin: 0; 
}

.service-card p { 
  margin: 5px 0 0; 
  color: #64748B; 
}

.how-to-use { 
  background-color: #FFFFFF; margin-top: 20px; 
  border-radius: 16px; 
  padding: 40px; 
}

.steps { 
  display: flex; 
  gap: 30px; 
}

.step { 
  width: 33.33%; 
  display: flex; 
  gap: 15px; 
}


.step-num {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>