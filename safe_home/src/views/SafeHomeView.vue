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

                <select v-model="selectedServiceId">

                  <option :value="null">
                    Select a service
                  </option>

                  <option
                    v-for="service in services"
                    :key="service.id"
                    :value="service.id"
                  >
                    {{ service.name }}
                  </option>

                </select>

              </div>

              <div class="input-group">

                <label>
                  Residence
                </label>

                <input
                  v-model="residenceName"
                  type="text"
                  placeholder="Enter residence name"
                />

              </div>

              <div class="input-group">

                <label>
                  Room number
                </label>

                <input
                  v-model="roomNumber"
                  type="text"
                  placeholder="e.g. Room 204"
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

        <!-- EMERGENCY SERVICES -->
        <section class="emergency-section">

          <div class="emergency-card">

            <div class="emergency-text">

              <span class="emergency-badge">
                🚨 URGENT HELP
              </span>

              <h2>
                Need help right now?
              </h2>

              <p>
                For urgent home emergencies, find providers who offer
                rapid response — day or night.
              </p>

              <div class="emergency-tags">

                <span
                  v-for="item in emergencyServices"
                  :key="item.name"
                  class="emergency-tag"
                  @click="selectEmergencyService(item)"
                >
                  {{ item.icon }} {{ item.name }}
                </span>

              </div>

            </div>

            <button
              class="emergency-btn"
              @click="findEmergencyHelp"
            >
              Find Emergency Help →
            </button>

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
              :key="service.id"
              class="service-card"
              @click="selectService(service)"
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
              {{
                isEmergencyMode
                  ? 'EMERGENCY PROVIDERS'
                  : 'NEARBY PROVIDERS'
              }}
            </span>

            <h2>
              {{
                isEmergencyMode
                  ? 'Rapid response professionals'
                  : 'Trusted professionals'
              }}
            </h2>

            <p>
              Providers available for
              <strong>
                {{ selectedService?.name || 'your service' }}
              </strong>
              {{ residenceName ? `at ${residenceName}` : '' }}.
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
                  {{ provider.full_name.charAt(0) }}
                </div>

                <div class="provider-info">

                  <h3>
                    {{ provider.full_name }}
                  </h3>

                  <div class="rating">
                    ⭐ {{ provider.rating }}

                    <span>
                      ({{ provider.rating_count }} reviews)
                    </span>
                  </div>

                </div>

                <span
                  v-if="provider.is_verified"
                  class="verified"
                >
                  ✓ Verified
                </span>

              </div>

              <p class="provider-bio">
                {{ provider.bio }}
              </p>

              <div class="problem-details">

                <label class="problem-label">
                  Describe your problem
                </label>

                <textarea
                  v-model="quoteForms[provider.id].description"
                  class="problem-textarea"
                  rows="3"
                  placeholder="e.g. Kitchen tap leaking under the sink..."
                ></textarea>

                <div class="photo-row">

                  <label class="photo-upload">

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      @change="handlePhotoUpload(provider.id, $event)"
                    />

                    <span
                      v-if="!quoteForms[provider.id].photoPreview"
                    >
                      📷 Add a photo
                    </span>

                    <span v-else>
                      ✓ Photo attached
                    </span>

                  </label>

                  <img
                    v-if="quoteForms[provider.id].photoPreview"
                    :src="quoteForms[provider.id].photoPreview"
                    class="photo-preview"
                    alt="Problem photo preview"
                    @click="removePhoto(provider.id)"
                    title="Click to remove"
                  />

                </div>

              </div>

              <div class="provider-footer">

                <span class="experience">
                  {{ provider.experience_years }} years experience
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

        <!-- CUSTOMER REVIEWS -->
        <section class="reviews-section">

          <div class="section-heading">

            <span>
              TESTIMONIALS
            </span>

            <h2>
              What our customers say
            </h2>

            <p>
              Real experiences from homeowners who found help through SafeHome.
            </p>

          </div>

          <div class="reviews-grid">

            <div
              v-for="review in reviews"
              :key="review.name"
              class="review-card"
            >

              <div class="review-stars">

                <span
                  v-for="n in review.stars"
                  :key="n"
                >
                  ⭐
                </span>

              </div>

              <p class="review-quote">
                “{{ review.quote }}”
              </p>

              <div class="review-author">

                <div class="review-avatar">
                  {{ review.name.charAt(0) }}
                </div>

                <div>

                  <strong>
                    — {{ review.name }}
                  </strong>

                  <span class="review-service">
                    {{ review.service }}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>

  </div>

</template>

<script setup>

import { ref, reactive, computed } from 'vue'
import Sidebar from '@/components/icons/sidebar.vue'
import Swal from 'sweetalert2'


/* =========================================================
   LAYOUT / SIDEBAR SYNC
========================================================= */

const sidebarRef = ref(null)

const sidebarWidth = computed(() => {

  if (!sidebarRef.value) return '250px'

  return sidebarRef.value.isCollapsed
    ? '72px'
    : '250px'

})


/* =========================================================
   PROFILE
========================================================= */

const profileImage = ref('')
const userName = ref('Guest')

const userInitial = computed(() =>
  userName.value.charAt(0).toUpperCase()
)


/* =========================================================
   STATE
========================================================= */

const selectedServiceId = ref(null)
const residenceName = ref('')
const roomNumber = ref('')
const showProviders = ref(false)
const isEmergencyMode = ref(false)


/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    id: 1,
    name: 'Plumbing',
    icon: '🔧',
    description:
      'Leaks, pipes, blocked drains and repairs.'
  },

  {
    id: 2,
    name: 'Electrical',
    icon: '⚡',
    description:
      'Electrical repairs, installations and maintenance.'
  },

  {
    id: 3,
    name: 'Cleaning',
    icon: '🧹',
    description:
      'Reliable home and deep cleaning services.'
  },

  {
    id: 4,
    name: 'Gardening',
    icon: '🌱',
    description:
      'Lawn care, landscaping and garden maintenance.'
  },

  {
    id: 5,
    name: 'Security',
    icon: '🛡️',
    description:
      'Home security and protection services.'
  },

  {
    id: 6,
    name: 'Handyman',
    icon: '🛠️',
    description:
      'General repairs, installations and maintenance.'
  }
]


/* =========================================================
   SELECTED SERVICE
========================================================= */

const selectedService = computed(() => {

  return services.find(
    service => service.id === selectedServiceId.value
  ) || null

})


/* =========================================================
   EMERGENCY SERVICES
========================================================= */

const emergencyServices = [

  {
    name: 'Emergency Plumbing',
    serviceName: 'Plumbing',
    serviceTypeId: 1,
    icon: '🚿'
  },

  {
    name: 'Emergency Electrical',
    serviceName: 'Electrical',
    serviceTypeId: 2,
    icon: '⚡'
  },

  {
    name: 'Locksmith',
    serviceName: 'Security',
    serviceTypeId: 5,
    icon: '🔑'
  },

  {
    name: 'Security',
    serviceName: 'Security',
    serviceTypeId: 5,
    icon: '🛡️'
  }

]


/* =========================================================
   PROVIDERS
   These match the database structure.
========================================================= */

const providers = ref([

  {
    id: 8,
    full_name: 'Cape Town Express Plumbing',
    rating: 4.9,
    rating_count: 22,
    experience_years: 8,
    bio:
      'Professional plumbing services for residential properties.',
    service_area: 'Cape Town',
    is_verified: true
  },

  {
    id: 9,
    full_name: 'Sipho Electrical Solutions',
    rating: 4.8,
    rating_count: 14,
    experience_years: 6,
    bio:
      'Reliable electrical repairs, installations and maintenance.',
    service_area: 'Cape Town',
    is_verified: true
  },

  {
    id: 10,
    full_name: 'Campus Handy Helpers',
    rating: 4.7,
    rating_count: 19,
    experience_years: 5,
    bio:
      'General home repairs and maintenance services.',
    service_area: 'Cape Town',
    is_verified: true
  },

  {
    id: 11,
    full_name: 'QuickFix Appliance Repair',
    rating: 4.6,
    rating_count: 11,
    experience_years: 4,
    bio:
      'Fast and reliable appliance repair services.',
    service_area: 'Cape Town',
    is_verified: true
  },

  {
    id: 12,
    full_name: 'Dorm Assembly & Carpentry',
    rating: 4.9,
    rating_count: 30,
    experience_years: 8,
    bio:
      'Furniture assembly, carpentry and general maintenance.',
    service_area: 'Cape Town',
    is_verified: true
  }

])


/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

const reviews = [

  {
    name: 'Sarah M.',
    service: 'Plumbing',
    stars: 5,
    quote:
      'Found a plumber within minutes and got a quote the same day.'
  },

  {
    name: 'Bongani K.',
    service: 'Electrical',
    stars: 5,
    quote:
      'The electrician arrived quickly and sorted our fault box the same afternoon. Great communication throughout.'
  },

  {
    name: 'Nomvula D.',
    service: 'Cleaning',
    stars: 4,
    quote:
      'Booking was simple and the cleaner did a fantastic job. Will definitely use SafeHome again.'
  }

]


/* =========================================================
   QUOTE REQUEST FORMS
   One form for each provider card.
========================================================= */

const quoteForms = reactive(

  Object.fromEntries(

    providers.value.map(provider => [

      provider.id,

      {
        description: '',
        photo: null,
        photoPreview: null
      }

    ])

  )

)


/* =========================================================
   FIND PROVIDERS
========================================================= */

function findProviders() {

  if (!selectedServiceId.value) {

    Swal.fire({
      title: 'Select a service',
      text: 'Please choose a service before finding providers.',
      icon: 'warning',
      confirmButtonText: 'Okay'
    })

    return
  }

  isEmergencyMode.value = false
  showProviders.value = true

  Swal.fire({
    title: 'Providers Found!',
    text: `We found providers for ${selectedService.value.name}.`,
    icon: 'success',
    confirmButtonText: 'View Providers'
  })

}


/* =========================================================
   SELECT NORMAL SERVICE
========================================================= */

function selectService(service) {

  selectedServiceId.value = service.id
  isEmergencyMode.value = false
  showProviders.value = true

}


/* =========================================================
   SELECT EMERGENCY SERVICE
========================================================= */

function selectEmergencyService(service) {

  selectedServiceId.value = service.serviceTypeId
  isEmergencyMode.value = true
  showProviders.value = true

}


/* =========================================================
   FIND EMERGENCY HELP
========================================================= */

function findEmergencyHelp() {

  isEmergencyMode.value = true

  if (!selectedServiceId.value) {

    selectedServiceId.value =
      emergencyServices[0].serviceTypeId

  }

  showProviders.value = true

  Swal.fire({
    title: '🚨 Emergency Help',
    text: 'Emergency providers are now being shown.',
    icon: 'warning',
    confirmButtonText: 'View Providers'
  })

}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

function handlePhotoUpload(providerId, event) {

  const file = event.target.files[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {

    Swal.fire({
      title: 'Invalid file',
      text: 'Please upload an image file.',
      icon: 'error',
      confirmButtonText: 'Okay'
    })

    event.target.value = ''

    return
  }

  quoteForms[providerId].photo = file

  const reader = new FileReader()

  reader.onload = (e) => {

    quoteForms[providerId].photoPreview =
      e.target.result

    Swal.fire({
      title: 'Photo Added!',
      text: 'Your problem photo has been attached successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })

  }

  reader.readAsDataURL(file)

}


/* =========================================================
   REMOVE PHOTO
========================================================= */

function removePhoto(providerId) {

  Swal.fire({
    title: 'Remove photo?',
    text: 'Are you sure you want to remove this photo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it',
    cancelButtonText: 'Keep photo'
  }).then((result) => {

    if (result.isConfirmed) {

      quoteForms[providerId].photo = null
      quoteForms[providerId].photoPreview = null

      Swal.fire({
        title: 'Removed!',
        text: 'The photo has been removed.',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      })

    }

  })

}


/* =========================================================
   GET QUOTE
========================================================= */

function getQuote(provider) {

  const form = quoteForms[provider.id]

  let message =
    `Quote request sent to ${provider.full_name}`

  if (selectedService.value) {

    message +=
      `\n\nService: ${selectedService.value.name}`

  }

  if (residenceName.value.trim()) {

    message +=
      `\nResidence: ${residenceName.value.trim()}`

  }

  if (roomNumber.value.trim()) {

    message +=
      `\nRoom: ${roomNumber.value.trim()}`

  }

  if (form.description.trim()) {

    message +=
      `\n\nProblem: ${form.description.trim()}`

  }

  if (form.photo) {

    message +=
      `\n📷 Photo attached: ${form.photo.name}`

  }

  if (isEmergencyMode.value) {

    message +=
      `\n\n🚨 Priority: EMERGENCY`

  }

  Swal.fire({

    title: isEmergencyMode.value
      ? '🚨 Emergency Quote Requested!'
      : 'Quote Requested!',

    text: message,

    icon: 'success',

    confirmButtonText: 'Okay'

  })

}

</script>

<style scoped>

/* =========================================================
   GLOBAL LAYOUT
========================================================= */

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


/* =========================================================
   TOP BAR / PROFILE
========================================================= */

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


/* =========================================================
   HERO
========================================================= */

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


/* =========================================================
   SEARCH
========================================================= */

.search-card {

  width: 100%;

  box-sizing: border-box;

  background: white;

  padding: 25px;

  border-radius: 18px;

  display: grid;

  grid-template-columns:
    1fr 1fr 1fr auto;

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


/* =========================================================
   BUTTON
========================================================= */

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


/* =========================================================
   EMERGENCY SECTION
========================================================= */

.emergency-section {

  width: 100%;

  max-width: 1200px;

  box-sizing: border-box;

  margin: -55px auto 0;

  padding: 0 40px;

  position: relative;

  z-index: 2;

}

.emergency-card {

  width: 100%;

  box-sizing: border-box;

  background:
    linear-gradient(
      135deg,
      #dc2626,
      #b91c1c
    );

  border-radius: 18px;

  padding: 32px 36px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 24px;

  flex-wrap: wrap;

  color: white;

  box-shadow:
    0 20px 40px
    rgba(220, 38, 38, 0.25);

}

.emergency-text {

  flex: 1;

  min-width: 260px;

}

.emergency-badge {

  display: inline-block;

  padding: 6px 12px;

  border-radius: 50px;

  background:
    rgba(255, 255, 255, 0.2);

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 1px;

  margin-bottom: 12px;

}

.emergency-text h2 {

  font-size: 26px;

  margin: 0 0 8px;

}

.emergency-text p {

  margin: 0 0 16px;

  opacity: 0.95;

  line-height: 1.6;

  max-width: 480px;

}

.emergency-tags {

  display: flex;

  flex-wrap: wrap;

  gap: 10px;

}

.emergency-tag {

  padding: 8px 14px;

  border-radius: 50px;

  background:
    rgba(255, 255, 255, 0.15);

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s ease;

  white-space: nowrap;

}

.emergency-tag:hover {

  background: white;

  color: #b91c1c;

}

.emergency-btn {

  border: none;

  background: white;

  color: #b91c1c;

  padding: 16px 26px;

  border-radius: 10px;

  font-weight: 800;

  font-size: 15px;

  cursor: pointer;

  white-space: nowrap;

  transition: 0.2s ease;

}

.emergency-btn:hover {

  background: #0D1B3D;

  color: white;

}


/* =========================================================
   SECTIONS
========================================================= */

.services-section,
.providers-section,
.reviews-section {

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


/* =========================================================
   SERVICES
========================================================= */

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

  background:
    #00a6a6;

  border-color:
    #00a6a6;

  box-shadow:
    0 10px 25px
    rgba(0, 166, 166, 0.25);

}

.service-card:hover h3,
.service-card:hover p,
.service-card:hover .view-service {

  color: white;

}

.service-card:hover .service-icon {

  background:
    rgba(255, 255, 255, 0.2);

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


/* =========================================================
   PROVIDERS
========================================================= */

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


/* =========================================================
   PROBLEM DETAILS
========================================================= */

.problem-details {

  display: flex;

  flex-direction: column;

  gap: 10px;

  padding: 14px;

  margin-bottom: 18px;

  background: #f8fafc;

  border:
    1px dashed #e2e8f0;

  border-radius: 12px;

}

.problem-label {

  font-size: 12px;

  font-weight: 700;

  color: #1e293b;

}

.problem-textarea {

  width: 100%;

  box-sizing: border-box;

  resize: vertical;

  min-height: 64px;

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  padding: 10px 12px;

  font-size: 13px;

  font-family: inherit;

  background: white;

  color: #1e293b;

}

.problem-textarea:focus {

  outline: none;

  border-color:
    #00a6a6;

}

.photo-row {

  display: flex;

  align-items: center;

  gap: 12px;

}

.photo-upload {

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 8px 14px;

  border-radius: 8px;

  border:
    1px solid #e2e8f0;

  background: white;

  font-size: 13px;

  font-weight: 700;

  color: #0D1B3D;

  cursor: pointer;

  transition: 0.2s ease;

}

.photo-upload:hover {

  border-color:
    #00a6a6;

  color:
    #00a6a6;

}

.photo-preview {

  width: 42px;

  height: 42px;

  border-radius: 8px;

  object-fit: cover;

  border:
    1px solid #e2e8f0;

  cursor: pointer;

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


/* =========================================================
   REVIEWS
========================================================= */

.reviews-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;

}

.review-card {

  background: white;

  padding: 26px;

  border-radius: 16px;

  border:
    1px solid #e2e8f0;

  display: flex;

  flex-direction: column;

  gap: 14px;

}

.review-stars {

  font-size: 15px;

  letter-spacing: 2px;

}

.review-quote {

  color:
    #334155;

  line-height: 1.7;

  font-size: 15px;

  font-style: italic;

  flex: 1;

}

.review-author {

  display: flex;

  align-items: center;

  gap: 12px;

}

.review-avatar {

  width: 38px;

  height: 38px;

  flex-shrink: 0;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background:
    #ede9fe;

  color:
    #0D1B3D;

  font-weight: 800;

  font-size: 14px;

}

.review-author strong {

  display: block;

  font-size: 14px;

}

.review-service {

  color:
    #94a3b8;

  font-size: 12px;

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .services-grid,
  .providers-grid,
  .reviews-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

  .search-card {

    grid-template-columns:
      1fr 1fr;

  }

  .search-btn {

    width: 100%;

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 800px) {

  /* Sidebar becomes an overlay */

  .main-content {

    width: 100%;

    margin-left: 0;

  }

  .top-bar {

    padding:
      14px 20px;

  }

  .hero {

    padding:
      50px 20px 70px;

  }

  .emergency-section {

    padding:
      0 20px;

    margin-top:
      -40px;

  }

  .emergency-card {

    padding: 26px;

    flex-direction: column;

    align-items: flex-start;

  }

  .emergency-btn {

    width: 100%;

  }

  .services-section,
  .providers-section,
  .reviews-section {

    padding:
      60px 20px;

  }

  .search-card {

    grid-template-columns:
      1fr;

  }

  .services-grid,
  .providers-grid,
  .reviews-grid {

    grid-template-columns:
      1fr;

  }

  .hero h1 {

    font-size: 44px;

  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

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
