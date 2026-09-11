<template>
  <div id="app">
    
    <div v-if="$route.path !== '/login'" class="layout-container">
<!--       
      <aside class="sidebar">

        <div class="logo-text" style="color: white;">

          CampusSwap 

          <span style="color: #F5B941;">
            SA
          </span>
        </div>
        
        <nav class="side-nav">

          <router-link to="/" class="nav-item">
            Home
          </router-link>

          <router-link to="/login" class="nav-item">
            Login
          </router-link>
          
          <router-link to="/student-dashboard" class="nav-item">
            Dashboard
          </router-link>

          <router-link to="/checkout" class="nav-item">
            Checkout
          </router-link>
        </nav>
      </aside> -->

      <main class="main-content">
        <router-view />
      </main>

    </div>

    <router-view v-else />
  </div>
</template>

<script>

export default {
  name: 'App'
};

</script>