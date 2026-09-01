<template>
  <div class="app-layout" :style="{ '--sidebar-w': sidebarWidth }">

    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" />

    <!-- Main Application -->
    <main class="main-content">

      <div class="safehome-page">

        <!-- TOP BAR -->
        <div class="top-bar">

          <div class="profile-pic" title="My Profile">
            <img
              v-if="profileImage"
              :src="profileImage"
              alt="Profile"
            />
            <span v-else>
              {{ userInitial }}
            </span>
          </div>

        </div>

        <!-- HERO -->
        <section class="hero">

          <div class="hero-content">

            <span class="badge">
              🏠 SafeHomeZA
            </span>

            <h1>
              Find trusted help<br />
              <span>when you need it.</span>
            </h1>

            <p>
              Connect with verified home service providers in your area.
              From plumbing and electrical work to cleaning and repairs,
              SafeHome makes finding help simple.
            </p>

            <!-- SEARCH -->
            <div class="search-card">

              <div class="input-group">

                <label>
                  What service do you need?
                </label>

                <select v-model="selectedService">

                  <option value="">
                    Select a service
                  </option>

                  <option value="Plumbing">
                    Plumbing
                  </option>

                  <option value="Electrical">
                    Electrical
                  </option>

                  <option value="Cleaning">
                    Cleaning
                  </option>

                  <option value="Gardening">
                    Gardening
                  </option>

                  <option value="Security">
                    Security
                  </option>

                  <option value="Handyman">
                    Handyman
                  </option>

                </select>

              </div>


              <div class="input-group">

                <label>
                  Where do you need help?
                </label>

                <input
                  v-model="location"
                  type="text"
                  placeholder="Enter your Location"
                />

              </div>


              <button
                class="search-btn"
                @click="findProviders"
              >
                Find Providers
              </button>

            </div>

          </div>

        </section>


        <!-- SERVICES -->
        <section class="services-section">

          <div class="section-heading">

            <span>
              OUR SERVICES
            </span>

            <h2>
              What can we help you with?
            </h2>

            <p>
              Choose a service and find trusted professionals near you.
            </p>

          </div>


          <div class="services-grid">

            <div
              v-for="service in services"
              :key="service.name"
              class="service-card"
              @click="selectService(service.name)"
            >

              <div class="service-icon">
                {{ service.icon }}
              </div>

              <h3>
                {{ service.name }}
              </h3>

              <p>
                {{ service.description }}
              </p>

              <span class="view-service">
                Find providers →
              </span>

            </div>

          </div>

        </section>


        <!-- PROVIDERS -->
        <section
          v-if="showProviders"
          class="providers-section"
        >

          <div class="section-heading">

            <span>
              NEARBY PROVIDERS
            </span>

            <h2>
              Trusted professionals
            </h2>

            <p>
              Providers available for

              <strong>
                {{ selectedService || 'your service' }}
              </strong>

              {{ location ? `in ${location}` : '' }}.
            </p>

          </div>


          <div class="providers-grid">

            <div
              v-for="provider in providers"
              :key="provider.id"
              class="provider-card"
            >

              <div class="provider-top">

                <div class="provider-avatar">
                  {{ provider.name.charAt(0) }}
                </div>

                <div class="provider-info">

                  <h3>
                    {{ provider.name }}
                  </h3>

                  <div class="rating">

                    ⭐ {{ provider.rating }}

                    <span>
                      ({{ provider.reviews }} reviews)
                    </span>

                  </div>

                </div>

                <span class="verified">
                  ✓ Verified
                </span>

              </div>


              <p class="provider-bio">
                {{ provider.bio }}
              </p>


              <div class="provider-footer">

                <span class="experience">
                  {{ provider.experience }} experience
                </span>

                <button
                  @click="getQuote(provider)"
                >
                  Get Quote
                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>

  </div>
</template>


<script setup>

import { ref, computed } from 'vue'

import Sidebar from '@/components/icons/sidebar.vue'


/* 
   LAYOUT / SIDEBAR SYNC
 */

const sidebarRef = ref(null)

const sidebarWidth = computed(() => {

  if (!sidebarRef.value) return '250px'

  return sidebarRef.value.isCollapsed
    ? '72px'
    : '250px'

})


/* 
   PROFILE
 */

// swap this out for real user data later
const profileImage = ref('')
const userName = ref('Guest')

const userInitial = computed(() =>
  userName.value.charAt(0).toUpperCase()
)


/*
   STATE
 */

const selectedService = ref('')

const location = ref('')

const showProviders = ref(false)


/* 
   SERVICES
 */

const services = [

  {
    name: 'Plumbing',
    icon: '🔧',
    description:
      'Leaks, pipes, blocked drains and repairs.'
  },

  {
    name: 'Electrical',
    icon: '⚡',
    description:
      'Electrical repairs, installations and maintenance.'
  },

  {
    name: 'Cleaning',
    icon: '🧹',
    description:
      'Reliable home and deep cleaning services.'
  },

  {
    name: 'Gardening',
    icon: '🌱',
    description:
      'Lawn care, landscaping and garden maintenance.'
  },

  {
    name: 'Security',
    icon: '🛡️',
    description:
      'Home security and protection services.'
  },

  {
    name: 'Handyman',
    icon: '🛠️',
    description:
      'General repairs, installations and maintenance.'
  }

]


/* 
   PROVIDERS
 */

const providers = ref([

  {
    id: 1,
    name: 'Thando M.',
    rating: 4.9,
    reviews: 127,
    experience: '8 years',
    bio:
      'Professional home service provider specialising in reliable residential repairs.'
  },

  {
    id: 2,
    name: 'Lwazi N.',
    rating: 4.7,
    reviews: 94,
    experience: '6 years',
    bio:
      'Experienced local professional known for quality work and fast response times.'
  },

  {
    id: 3,
    name: 'Ayanda P.',
    rating: 4.8,
    reviews: 81,
    experience: '5 years',
    bio:
      'Friendly and dependable service provider serving homes across the local community.'
  }

])


/* 
   FUNCTIONS
 */

function findProviders() {

  showProviders.value = true

}


function selectService(service) {

  selectedService.value = service

  showProviders.value = true

}


function getQuote(provider) {

  alert(
    `Quote request sent to ${provider.name}`
  )

}

</script>


<style scoped>

/* 
   GLOBAL LAYOUT
*/

.app-layout {

  width: 100%;

  min-height: 100vh;

  background: #f8fafc;

}


.main-content {

  width: calc(100% - var(--sidebar-w, 250px));

  margin-left: var(--sidebar-w, 250px);

  min-height: 100vh;

  transition:
    margin-left 0.25s ease,
    width 0.25s ease;

}


.safehome-page {

  width: 100%;

  min-height: 100vh;

  background: #f8fafc;

  color: #1e293b;

}


/* 
   TOP BAR / PROFILE
 */

.top-bar {

  width: 100%;

  box-sizing: border-box;

  padding: 16px 40px;

  display: flex;

  align-items: center;

  justify-content: flex-start;

  background: #f8fafc;

}


.profile-pic {

  width: 42px;

  height: 42px;

  border-radius: 50%;

  overflow: hidden;

  display: grid;

  place-items: center;

  background: #0D1B3D;

  color: white;

  font-weight: 800;

  font-size: 16px;

  cursor: pointer;

  border: 2px solid white;

  box-shadow:
    0 2px 8px
    rgba(15, 23, 42, 0.12);

}


.profile-pic img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}


/* 
   HERO
*/

.hero {

  width: 100%;

  background:
    linear-gradient(
      135deg,
      #0D1B3D,
      #7c3aed
    );

  padding:
    60px 40px 100px;

  color: white;

  box-sizing: border-box;

}


.hero-content {

  width: 100%;

  max-width: 1200px;

  margin: auto;

}


.badge {

  display: inline-block;

  padding: 8px 14px;

  border-radius: 50px;

  background:
    rgba(255, 255, 255, 0.15);

  font-size: 14px;

  margin-bottom: 20px;

}


.hero h1 {

  font-size:
    clamp(42px, 6vw, 70px);

  line-height: 1.05;

  margin: 0;

  font-weight: 800;

}


.hero h1 span {

  color: #ddd6fe;

}


.hero p {

  max-width: 650px;

  font-size: 18px;

  line-height: 1.7;

  margin:
    25px 0 35px;

  opacity: 0.9;

}


/* 
   SEARCH
*/

.search-card {

  width: 100%;

  box-sizing: border-box;

  background: white;

  padding: 25px;

  border-radius: 18px;

  display: grid;

  grid-template-columns:
    1fr 1fr auto;

  gap: 18px;

  align-items: end;

  box-shadow:
    0 20px 40px
    rgba(15, 23, 42, 0.2);

  color: #1e293b;

}


.input-group {

  display: flex;

  flex-direction: column;

  gap: 8px;

}


.input-group label {

  font-size: 13px;

  font-weight: 700;

}


.input-group input,
.input-group select {

  width: 100%;

  box-sizing: border-box;

  height: 48px;

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  padding:
    0 14px;

  font-size: 15px;

  background: #f8fafc;

}


.input-group input:focus,
.input-group select:focus {

  outline: none;

  border-color:
    #00a6a6;

}


/* 
   BUTTON
 */

.search-btn,
.provider-footer button {

  border: none;

  background:
    #0D1B3D;

  color: white;

  padding:
    14px 22px;

  border-radius: 10px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;

}


.search-btn:hover,
.provider-footer button:hover {

  background:
    #00a6a6;

}


/* 
   SECTIONS
 */

.services-section,
.providers-section {

  width: 100%;

  max-width: 1200px;

  box-sizing: border-box;

  margin: auto;

  padding:
    80px 40px;

}


.section-heading {

  margin-bottom: 40px;

}


.section-heading > span {

  color:
    #2e7d5a;

  font-size: 13px;

  font-weight: 800;

  letter-spacing: 1.5px;

}


.section-heading h2 {

  font-size: 36px;

  margin:
    8px 0;

}


.section-heading p {

  color:
    #64748b;

}


/* 
   SERVICES
 */

.services-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;

}


.service-card {

  background: white;

  padding: 28px;

  border-radius: 16px;

  border:
    1px solid #e2e8f0;

  cursor: pointer;

  transition: 0.2s ease;

}


.service-card:hover {

  transform:
    translateY(-5px);

  border-color:
    #2e7d5a;

  box-shadow:
    0 10px 25px
    rgba(46, 125, 90, 0.12);

}


.service-icon {

  width: 52px;

  height: 52px;

  display: grid;

  place-items: center;

  background:
    #ede9fe;

  border-radius: 12px;

  font-size: 25px;

  margin-bottom: 18px;

}


.service-card h3 {

  margin-bottom: 8px;

}


.service-card p {

  color:
    #64748b;

  line-height: 1.6;

  font-size: 14px;

}


.view-service {

  display: inline-block;

  margin-top: 10px;

  color:
    #0D1B3D;

  font-weight: 700;

  font-size: 14px;

}


/* 
   PROVIDERS
*/

.providers-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;

}


.provider-card {

  background: white;

  padding: 24px;

  border-radius: 16px;

  border:
    1px solid #e2e8f0;

}


.provider-top {

  display: flex;

  align-items: center;

  gap: 12px;

}


.provider-avatar {

  width: 50px;

  height: 50px;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background:
    #0D1B3D;

  color: white;

  font-weight: 800;

  font-size: 18px;

}


.provider-info {

  min-width: 0;

}


.provider-top h3 {

  margin:
    0 0 4px;

}


.rating {

  font-size: 14px;

}


.rating span {

  color:
    #94a3b8;

}


.verified {

  margin-left: auto;

  color:
    #2e7d5a;

  font-size: 12px;

  font-weight: 700;

  white-space: nowrap;

}


.provider-bio {

  color:
    #64748b;

  line-height: 1.6;

  font-size: 14px;

  margin:
    20px 0;

}


.provider-footer {

  display: flex;

  justify-content:
    space-between;

  align-items: center;

  gap: 10px;

}


.experience {

  color:
    #64748b;

  font-size: 13px;

}


/*
   TABLET
*/

@media (max-width: 1000px) {

  .services-grid,
  .providers-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


/* 
   MOBILE
 */

@media (max-width: 800px) {

  /* sidebar becomes an overlay, so main content
     stops reserving space for it entirely */

  .main-content {

    width: 100%;

    margin-left: 0;

  }


  .top-bar {

    padding: 14px 20px;

  }


  .hero {

    padding:
      50px 20px 70px;

  }


  .services-section,
  .providers-section {

    padding:
      60px 20px;

  }


  .search-card {

    grid-template-columns:
      1fr;

  }


  .services-grid,
  .providers-grid {

    grid-template-columns:
      1fr;

  }


  .hero h1 {

    font-size: 44px;

  }

}


@media (max-width: 500px) {

  .hero h1 {

    font-size: 38px;

  }


  .hero p {

    font-size: 16px;

  }


  .section-heading h2 {

    font-size: 28px;

  }

}

</style>