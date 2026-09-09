<template>
  <div class="home-page">

    <!--TOP BAR-->
    <header class="top-bar">
      <div class="top-left">
        <button class="hamburger-btn" @click="toggleSideNav" aria-label="Open menu">
          <span class="hamburger-icon">&#9776;</span>
        </button>
        <h2 class="brand">
          CampusSwap<span class="green-text">SA</span>
        </h2>
      </div>

      <div class="top-center">
        <div class="search-wrap">
          <span class="search-icon">&#128269;</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search books, services, and more..."
          />
        </div>
      </div>

      <div class="top-right" v-if="isLoggedIn">
        <span class="avatar">MN</span>
      </div>
      <div class="top-right" v-else>
        <span class="avatar-placeholder"></span>
      </div>
    </header>

    <!-- ================================================================
    SIDE NAV (slide-out)
    ================================================================ -->
    <div
      class="side-overlay"
      :class="{ 'side-overlay-open': sideNavOpen }"
      @click="closeSideNav"
    ></div>

    <div class="side-nav" :class="{ 'side-nav-open': sideNavOpen }">
      <div class="side-nav-header">
        <h3>CampusSwap<span class="green-text">SA</span></h3>
        <button class="close-side-btn" @click="closeSideNav">&times;</button>
      </div>
      <ul class="side-nav-links">
        <li><router-link to="/" @click="closeSideNav">Home</router-link></li>
        <li><router-link to="/login" @click="closeSideNav">Login</router-link></li>
        <!-- <li><router-link to="/academic" @click="closeSideNav">Academic</router-link></li>
        <li><router-link to="/safehome" @click="closeSideNav">SafeHome</router-link></li>
        <li><router-link to="/checkout" @click="closeSideNav">Checkout</router-link></li> -->
        <li><router-link to="/student-dashboard" @click="closeSideNav">Dashboard</router-link></li>
      </ul>
      <div class="side-nav-user" v-if="isLoggedIn">
        <p>Hi! {{ user.name }}</p>
        <p class="side-user-uni">{{ user.university }}</p>
      </div>
    </div>

    <!-- ================================================================
    HERO SECTION
    ================================================================ -->
    <section class="hero full-section">
      <div class="hero-inner">
        <div class="hero-text">
          <p class="hero-tagline">SOUTH AFRICA'S SECURE STUDENT EXCHANGE</p>
          <h1 class="hero-title">
            One Campus. Endless Possibilities.<br />All In One Place.
          </h1>
          <p class="hero-desc">
            Connect directly with verified students at your institution.
            Safely trade, buy, rent books, technology, and book maintenance services.
          </p>
          <button class="btn-gold" @click="handleBrowseDeals">
            Browse Active Campus Deals
          </button>
        </div>
        <div class="hero-image">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop&crop=center"
            alt="Diverse South African university students"
            class="hero-img"
          />
        </div>
      </div>
      <div class="scroll-indicator">
        <span>Scroll</span>
        <span class="scroll-arrow">&#8595;</span>
      </div>
    </section>

    <!-- ================================================================
    CORE SERVICES
    ================================================================ -->
    <section class="core-services full-section">
      <h2 class="section-title">Core Student Services</h2>
      <div class="service-cards">
        <div class="service-card">
          <div class="card-icon">&#128218;</div>
          <h3>Academic Marketplace</h3>
          <p>Buy &amp; rent textbooks, tech, and study materials from fellow students.</p>
          <button class="card-btn" @click="goToAcademic">Browse Marketplace</button>
        </div>
        <div class="service-card">
          <div class="card-icon">&#128736;</div>
          <h3>SafeHome</h3>
          <p>Book background-checked handymen for cleaning, repairs, and many more services.</p>
          <button class="card-btn" @click="goToSafeHome">Book SafeHome</button>
        </div>
      </div>
      <div class="scroll-indicator scroll-indicator-light">
        <span>Scroll</span>
        <span class="scroll-arrow">&#8595;</span>
      </div>
    </section>

    <!-- ================================================================
    TUTORIAL – How CampusSwap Works
    ================================================================ -->
    <section class="tutorial-section full-section">
      <div class="tutorial">
        <h2 class="tutorial-title">How CampusSwap Works</h2>
        <div class="steps">
          <div class="step">
            <span class="step-num">1</span>
            <div class="step-body">
              <h3>Verify Your Profile</h3>
              <p>Sign up with your SA university email or work email to ensure a safe environment.</p>
            </div>
          </div>
          <div class="step">
            <span class="step-num">2</span>
            <div class="step-body">
              <h3>Buy, Sell or Book</h3>
              <p>List textbooks you no longer need, find rentals or book background-checked campus handymen.</p>
            </div>
          </div>
          <div class="step">
            <span class="step-num">3</span>
            <div class="step-body">
              <h3>Secure Escrow</h3>
              <p>Payments are held securely in escrow until you verify everything is received and correct.</p>
            </div>
          </div>
        </div>
        <div class="tutorial-actions" v-if="isLoggedIn">
          <button class="btn-outline-gold" @click="goToAcademic">Browse Academic Marketplace</button>
          <button class="btn-outline-green" @click="goToSafeHome">Book SafeHome Repairs</button>
        </div>
        <div class="tutorial-actions" v-else>
          <p class="login-prompt purple-bold">
            &#128274; <a href="#" @click.prevent="toggleLogin">Log in</a> with your university email to access all features.
          </p>
        </div>
      </div>
      <div class="scroll-indicator scroll-indicator-light">
        <span>Scroll</span>
        <span class="scroll-arrow">&#8595;</span>
      </div>
    </section>

    <!-- ================================================================
    FEATURED NEAR YOU
    ================================================================ -->
    <section class="featured-section full-section">
      <div class="featured-inner">
        <h2 class="section-title">Featured Near You</h2>
        <div class="featured-grid">
          <div class="featured-item">
            <div class="item-image">📱</div>
            <h4>HP EliteBook 840 G5</h4>
            <p class="item-price">R4,500</p>
            <span class="item-badge">Used Like New</span>
          </div>
          <div class="featured-item">
            <div class="item-image">📘</div>
            <h4>Calculus MAM1000W Guide</h4>
            <p class="item-price">R350</p>
            <span class="item-badge">UCT Guide</span>
          </div>
          <div class="featured-item">
            <div class="item-image">🧮</div>
            <h4>TI-Plus Graphing Calc</h4>
            <p class="item-price">R1,200</p>
            <span class="item-badge">ACT Rewards</span>
          </div>
          <div class="featured-item">
            <div class="item-image">🎧</div>
            <h4>Sony ANC Headphones</h4>
            <p class="item-price">R1,800</p>
            <span class="item-badge">Use Now</span>
          </div>
        </div>
      </div>
      <div class="scroll-indicator scroll-indicator-light">
        <span>Scroll</span>
        <span class="scroll-arrow">&#8595;</span>
      </div>
    </section>

    <!-- ================================================================
    FOOTER
    ================================================================ -->
    <footer>
      <div class="footer-brand">
        <h3 class="footer-logo">CampusSwap<span class="green-text">SA</span></h3>
        <p>
          South Africa's trusted, student-only platform for secure peer trading,
          verified off-campus support services, and educational material exchange.
        </p>
      </div>
      <div class="footer-links">
        <h4>Services</h4>
        <ul>
          <li><a href="#">Academic Marketplace</a></li>
          <li><a href="#">SafeHome Maintenance</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Trust &amp; Protection</h4>
        <ul>
          <li><a href="#">Ozow Escrow Guarantee</a></li>
          <li><a href="#">EduID Authentication</a></li>
          <li><a href="#">Safety Zones &amp; Meetups</a></li>
        </ul>
      </div>
    </footer>

  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'HomePage',
  data() {
    return {
      isLoggedIn: false,
      sideNavOpen: false,
      user: {
        name: 'Myles N.',
        university: 'University of Cape Town'
      }
    };
  },
  methods: {
    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen;
      document.body.style.overflow = this.sideNavOpen ? 'hidden' : '';
    },
    closeSideNav() {
      this.sideNavOpen = false;
      document.body.style.overflow = '';
    },

    
    async handleBrowseDeals() {
      if (this.isLoggedIn) {
        await Swal.fire({
          icon: 'info',
          title: 'Navigating...',
          text: 'You are being redirected to Campus Deals.',
          timer: 1500,
          showConfirmButton: false,
        });
        
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please log in with your university email to view deals.',
          confirmButtonColor: '#f5b941',
        });
      }
    },

    //  3. Toggle login with a confirmation 
    async toggleLogin() {
      if (this.isLoggedIn) {
        // If they are about to log out, ask for confirmation
        const result = await Swal.fire({
          title: 'Logout?',
          text: 'Are you sure you want to log out?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, logout',
          cancelButtonText: 'Cancel',
        });
        if (result.isConfirmed) {
          this.isLoggedIn = false;
          Swal.fire('Logged Out', 'You have been logged out.', 'success');
        }
      } else {
        // If logging in, just toggle (or you could show a success message)
        this.isLoggedIn = true;
        Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: 'You are now logged in.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },

    // -------- 4. Academic and SafeHome buttons --------
    async goToAcademic() {
      await Swal.fire({
        icon: 'info',
        title: 'Academic Marketplace',
        text: 'Navigating to browse textbooks, tech, and study materials.',
        timer: 1500,
        showConfirmButton: false,
      });
    },

    async goToSafeHome() {
      await Swal.fire({
        icon: 'info',
        title: 'SafeHome',
        text: 'Navigating to book handyman services.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
}; 

</script>

<style scoped>
  
  .home-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    color: #333333;
    margin: 0px;
    padding: 0px;
  }

  /* FULL VIEWPORT SECTIONS*/
  .full-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 60px 30px;
    box-sizing: border-box;
  }

  /* TOP BAR */
  .top-bar {
    background-color: #0d1b3d;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: sticky;
    top: 0px;
    z-index: 100;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
    flex-wrap: wrap;
  }

  .top-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .hamburger-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger-icon {
    font-size: 28px;
    color: #ffffff;
    line-height: 1;
  }

  .brand {
    color: #ffffff;
    font-size: 22px;
    margin: 0px;
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .brand .green-text,
  .green-text {
    color: #2e7d5a;
  }

  .top-center {
    flex: 1;
    min-width: 160px;
    max-width: 520px;
  }

  .search-wrap {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    padding: 6px 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .search-wrap:hover,
  .search-wrap:focus-within {
    background-color: rgba(255, 255, 255, 0.20);
    border-color: rgba(245, 185, 65, 0.4);
  }

  .search-icon {
    color: #9ca3af;
    font-size: 16px;
    margin-right: 10px;
  }

  .search-input {
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 14px;
    padding: 8px 0px;
    width: 100%;
    font-weight: 400;
  }

  .search-input::placeholder {
    color: #9ca3af;
    font-weight: 300;
  }

  .top-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .avatar {
    background-color: #f5b941;
    color: #0d1b3d;
    font-weight: 700;
    font-size: 14px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }

  .avatar-placeholder {
    width: 36px;
    height: 36px;
  }

  /*  SIDE NAV */
  .side-overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 200;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .side-overlay-open {
    opacity: 1;
    visibility: visible;
  }

  .side-nav {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 280px;
    height: 100%;
    background-color: #0d1b3d;
    z-index: 300;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    padding: 20px 24px;
    box-shadow: 4px 0px 16px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .side-nav-open {
    transform: translateX(0px);
  }

  .side-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .side-nav-header h3 {
    color: #ffffff;
    font-size: 20px;
    margin: 0px;
  }

  .side-nav-header .green-text {
    color: #2e7d5a;
  }

  .close-side-btn {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 28px;
    cursor: pointer;
    padding: 0px 4px;
    line-height: 1;
  }

  .close-side-btn:hover {
    color: #f5b941;
  }

  .side-nav-links {
    list-style: none;
    padding: 0px;
    margin: 0px;
    flex: 1;
  }

  .side-nav-links li {
    margin-bottom: 4px;
  }

  .side-nav-links li a {
    display: block;
    color: #d1d5db;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 3px solid transparent;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }

  .side-nav-links li a:hover {
    background-color: rgba(245, 185, 65, 0.12);
    color: #f5b941;
    border-left-color: #f5b941;
  }

  .side-nav-user {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }

  .side-nav-user p {
    margin: 4px 0px;
    font-size: 14px;
  }

  .side-user-uni {
    font-size: 12px;
    opacity: 0.7;
  }

  /* ================================================================
     HERO SECTION
     ================================================================ */
  .hero {
    background-color: #0d1b3d;
    color: #ffffff;
  }

  .hero-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    max-width: 1100px;
    width: 100%;
    margin: 0px auto;
    flex-wrap: wrap;
  }

  .hero-text {
    flex: 1 1 50%;
    min-width: 300px;
  }

  .hero-tagline {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 3px;
    color: #f5b941;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .hero-title {
    font-size: 40px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .hero-desc {
    font-size: 18px;
    font-weight: 400;
    color: #d1d5db;
    max-width: 500px;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .btn-gold {
    background-color: #f5b941;
    color: #0d1b3d;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.25s ease, transform 0.15s ease;
  }

  .btn-gold:hover {
    background-color: #e0a330;
    transform: translateY(-2px);
  }

  .btn-gold:active {
    transform: translateY(0px);
  }

  .hero-image {
    flex: 1 1 40%;
    min-width: 280px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.4);
  }

  .hero-img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  /* ================================================================
     CORE SERVICES
     ================================================================ */
  .core-services {
    background-color: #f8f9fa;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .section-title {
    color: #0d1b3d;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 36px;
    text-align: center;
  }

  .service-cards {
    display: flex;
    gap: 32px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 900px;
    margin: 0px auto;
  }

  .service-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 32px 28px 30px;
    width: 280px;
    text-align: center;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background-color 0.35s ease, transform 0.25s ease, box-shadow 0.35s ease;
  }

  .service-card:hover {
    background-color: #00a6a6;
    transform: translateY(-6px);
    box-shadow: 0px 12px 32px rgba(0, 166, 166, 0.25);
  }

  .service-card:hover h3,
  .service-card:hover p,
  .service-card:hover .card-icon {
    color: #ffffff;
  }

  .service-card:hover .card-btn {
    background-color: #ffffff;
    color: #00a6a6;
    border-color: #ffffff;
  }

  .card-icon {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
    transition: color 0.35s ease;
  }

  .service-card h3 {
    color: #0d1b3d;
    font-size: 20px;
    margin: 0px 0px 8px 0px;
    transition: color 0.35s ease;
  }

  .service-card p {
    color: #4b5563;
    font-size: 15px;
    line-height: 1.5;
    margin: 0px 0px 18px 0px;
    transition: color 0.35s ease;
  }

  .card-btn {
    background-color: #0d1b3d;
    color: #ffffff;
    border: 2px solid #0d1b3d;
    border-radius: 30px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
    margin-top: auto;
  }

  .card-btn:hover {
    transform: scale(1.04);
    background-color: #f5b941;
    border-color: #f5b941;
    color: #0d1b3d;
  }

  /* ================================================================
     TUTORIAL
     ================================================================ */
  .tutorial-section {
    background-color: #f0f2f5;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .tutorial {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 40px 36px 44px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.06);
    max-width: 820px;
    width: 100%;
    margin: 0px auto;
  }

  .tutorial-title {
    color: #0d1b3d;
    font-size: 28px;
    text-align: center;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 32px;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .step-num {
    background-color: #f5b941;
    color: #0d1b3d;
    font-weight: 700;
    font-size: 18px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .step-body h3 {
    color: #2e7d5a;
    font-size: 19px;
    margin: 0px 0px 4px 0px;
  }

  .step-body p {
    color: #4b5563;
    font-size: 15px;
    margin: 0px;
    line-height: 1.5;
  }

  .tutorial-actions {
    margin-top: 36px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 32px;
  }

  .btn-outline-gold {
    background: transparent;
    border: 2px solid #f5b941;
    color: #0d1b3d;
    font-weight: 600;
    font-size: 15px;
    padding: 10px 26px;
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;
  }

  .btn-outline-gold:hover {
    background-color: #f5b941;
    color: #0d1b3d;
    transform: translateY(-2px);
  }

  .btn-outline-green {
    background: transparent;
    border: 2px solid #2e7d5a;
    color: #2e7d5a;
    font-weight: 600;
    font-size: 15px;
    padding: 10px 26px;
    border-radius: 30px;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;
  }

  .btn-outline-green:hover {
    background-color: #2e7d5a;
    color: #ffffff;
    transform: translateY(-2px);
  }

  .login-prompt.purple-bold {
    color: #6c4b6a;
    font-weight: 700;
    font-size: 16px;
    margin: 0px;
  }

  .login-prompt.purple-bold a {
    color: #f5b941;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease;
  }

  .login-prompt.purple-bold a:hover {
    border-bottom-color: #f5b941;
  }

  /* ================================================================
     FEATURED NEAR YOU
     ================================================================ */
  .featured-section {
    background-color: #ffffff;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .featured-inner {
    max-width: 1100px;
    width: 100%;
    margin: 0px auto;
    text-align: center;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }

  .featured-item {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 20px 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-align: center;
    border: 1px solid #e5e7eb;
  }

  .featured-item:hover {
    transform: translateY(-4px);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
  }

  .item-image {
    font-size: 40px;
    margin-bottom: 8px;
  }

  .featured-item h4 {
    font-size: 16px;
    font-weight: 600;
    color: #0d1b3d;
    margin: 8px 0px 4px;
  }

  .item-price {
    font-size: 18px;
    font-weight: 700;
    color: #2e7d5a;
    margin: 4px 0px;
  }

  .item-badge {
    display: inline-block;
    background-color: #f5b941;
    color: #0d1b3d;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    margin-top: 6px;
  }

  /* ================================================================
     SCROLL INDICATOR
     ================================================================ */
  .scroll-indicator {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    font-size: 13px;
    letter-spacing: 2px;
    opacity: 0.7;
    font-weight: 300;
    animation: float-down 2.2s ease-in-out infinite;
    cursor: default;
  }

  .scroll-indicator-light {
    color: #6b7280;
  }

  .scroll-arrow {
    font-size: 22px;
    line-height: 1;
    margin-top: 2px;
  }

  @keyframes float-down {
    0% {
      transform: translateX(-50%) translateY(0px);
      opacity: 0.5;
    }
    50% {
      transform: translateX(-50%) translateY(8px);
      opacity: 1;
    }
    100% {
      transform: translateX(-50%) translateY(0px);
      opacity: 0.5;
    }
  }

  /* ================================================================
     FOOTER
     ================================================================ */
  footer {
    background-color: #050c1e;
    color: #ffffff;
    padding: 40px 30px 36px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 30px;
    border-top: 3px solid #f5b941;
  }

  .footer-brand {
    max-width: 340px;
  }

  .footer-logo {
    color: #ffffff;
    font-size: 22px;
    margin: 0px 0px 12px 0px;
  }

  .footer-brand p {
    color: #9ca3af;
    font-size: 14px;
    line-height: 1.7;
    margin: 0px;
  }

  .footer-links h4 {
    color: #f5b941;
    margin: 0px 0px 14px 0px;
    font-size: 16px;
    font-weight: 600;
  }

  .footer-links ul {
    list-style: none;
    padding: 0px;
    margin: 0px;
  }

  .footer-links li {
    margin-bottom: 10px;
  }

  .footer-links a {
    color: #d1d5db;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: #ffffff;
  }

  /* ================================================================
     RESPONSIVE
     ================================================================ */
  @media (max-width: 992px) {
    .hero-title {
      font-size: 32px;
    }
    .hero-desc {
      font-size: 16px;
    }
    .top-center {
      max-width: 300px;
    }
    .featured-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .top-bar {
      padding: 10px 16px;
      gap: 10px;
    }

    .brand {
      font-size: 18px;
    }

    .top-center {
      order: 3;
      flex-basis: 100%;
      max-width: 100%;
      min-width: 0px;
    }

    .search-wrap {
      padding: 4px 14px;
    }

    .search-input {
      font-size: 13px;
      padding: 6px 0px;
    }

    .top-right {
      display: none;
    }

    .hero-inner {
      flex-direction: column;
      text-align: center;
      gap: 30px;
    }

    .hero-text {
      flex: 1 1 100%;
      min-width: 0px;
    }

    .hero-desc {
      max-width: 100%;
    }

    .hero-image {
      flex: 1 1 100%;
      min-width: 0px;
      width: 100%;
      max-width: 500px;
    }

    .hero-title {
      font-size: 28px;
    }

    .hero-desc {
      font-size: 15px;
    }

    .btn-gold {
      font-size: 14px;
      padding: 12px 24px;
    }

    .full-section {
      padding: 40px 16px;
      min-height: 100vh;
    }

    .core-services {
      padding: 30px 16px 40px;
    }

    .section-title {
      font-size: 24px;
    }

    .service-cards {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .service-card {
      width: 100%;
      max-width: 360px;
      padding: 24px 18px 22px;
    }

    .tutorial-section {
      padding: 30px 16px 40px;
    }

    .tutorial {
      padding: 24px 18px 28px;
    }

    .tutorial-title {
      font-size: 22px;
    }

    .step {
      gap: 14px;
    }

    .step-num {
      width: 38px;
      height: 38px;
      font-size: 16px;
    }

    .step-body h3 {
      font-size: 17px;
    }

    .step-body p {
      font-size: 14px;
    }

    .tutorial-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn-outline-gold,
    .btn-outline-green {
      width: 100%;
      max-width: 260px;
      text-align: center;
    }

    .login-prompt.purple-bold {
      font-size: 14px;
      text-align: center;
    }

    .featured-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    footer {
      flex-direction: column;
      padding: 30px 18px 24px;
      gap: 24px;
    }

    .footer-brand {
      max-width: 100%;
    }

    .scroll-indicator {
      bottom: 16px;
      font-size: 12px;
    }
    .scroll-arrow {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 22px;
    }

    .hero-desc {
      font-size: 14px;
    }

    .brand {
      font-size: 16px;
    }

    .hamburger-icon {
      font-size: 24px;
    }

    .search-input {
      font-size: 12px;
    }

    .service-card {
      max-width: 300px;
    }

    .featured-grid {
      grid-template-columns: 1fr;
    }

    .side-nav {
      width: 260px;
      padding: 16px 18px;
    }
  }
</style>