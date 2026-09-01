<template>
  <div class="login-page">
    <!-- Left side -->
    <div class="login-left">

      <div class="logo-text" style="color: white;">CampusSwap <span style="color: #2E7D5A;">SA</span></div>

      <h1>One Campus. Endless Possibilities. All in One Place.</h1>

      <p>Trade textbooks, book verified repairs, and safely connect with students!</p>
    </div>

    <!-- Right side (Form) -->
    <div class="login-right">
      <h2>Student Verification</h2>
      
      <div class="form-group">
        <label>Institution Email</label>
        <input type="email" placeholder="myles.naidoo@myuct.ac.za" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" placeholder="*******;)" />
      </div>

      <button class="btn btn-primary" @click="$router.push('/dashboard')">Verify & Enter CampusSwap</button>
      
      <p style="text-align: center; margin-top: 20px; color: #64748B;">
        New here? <a href="#" style="color: #2E7D5A; font-weight: bold;">C'mon Create an account</a>
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.login-page { 
  display: flex; 
  width: 100%; 
  height: 100%; 
}

.login-left {
  width: 50%;
  background-color: #0D1B3D;
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-left h1 { 
  font-size: 48px; 
  line-height: 1.2; 
}

.login-left p { 
  opacity: 0.8; 
}

.login-right {
  width: 50%;
  background-color: #FFFFFF;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-group { 
  margin-bottom: 20px; 
}

label { 
  color: #64748B; 
  font-size: 14px; 
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #CCCCCC;
  border-radius: 8px;
  margin-top: 5px;
}
</style>