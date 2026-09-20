<template>
  <div class="app-layout">
    <!-- =====================================================
         TOP BAR
    ====================================================== -->
    <header class="top-bar">
      <div class="top-left">
        <button
          class="hamburger-btn"
          @click="toggleSideNav"
          aria-label="Open menu"
        >
          <span class="hamburger-icon">
            <AppIcon name="dashboard" />
          </span>
        </button>

        <router-link to="/" class="brand-link">
          <h2 class="brand">
            CampusSwap<span class="green-text">SA</span>
          </h2>
        </router-link>
      </div>

      <div class="top-center">
        <div class="search-wrap">
          <input
            type="text"
            class="search-input"
            placeholder="Search books, services, and more..."
          />
        </div>
      </div>

      <div class="top-right">
        <div
          class="notification-bell"
          @click="showNotifications"
        >
          <span class="bell-icon">
            <AppIcon name="alert" />
          </span>

          <span class="notification-dot"></span>
        </div>

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
    </header>

    <!-- =====================================================
         SIDE NAV OVERLAY
    ====================================================== -->
    <div
      class="side-overlay"
      :class="{ 'side-overlay-open': sideNavOpen }"
      @click="closeSideNav"
    ></div>

    <!-- =====================================================
         SIDE NAV
    ====================================================== -->
    <div
      class="side-nav"
      :class="{ 'side-nav-open': sideNavOpen }"
    >
      <div class="side-nav-header">
        <h3>
          CampusSwap<span class="green-text">SA</span>
        </h3>

        <button
          class="close-side-btn"
          @click="closeSideNav"
        >
          &times;
        </button>
      </div>

      <!-- Navigation links -->
      <ul class="side-nav-links">
        <li>
          <router-link
            to="/"
            @click="closeSideNav"
          >
            Home
          </router-link>
        </li>

        <!-- Academic Marketplace -->
        <!--
        <li
          v-if="
            userRole === 'student' ||
            userRole === 'admin'
          "
        >
          <router-link
            to="/academic"
            @click="closeSideNav"
          >
            Academic Marketplace
          </router-link>
        </li>
        -->

        <!-- SafeHome -->
        <li>
          <router-link
            to="/safehome"
            @click="closeSideNav"
          >
            SafeHome
          </router-link>
        </li>

        <!-- Checkout -->
        <li
          v-if="
            userRole === 'student' ||
            userRole === 'admin' ||
            userRole === 'resmanager'
          "
        >
          <router-link
            to="/checkout"
            @click="closeSideNav"
          >
            Checkout
          </router-link>
        </li>

        <!-- Dashboard -->
        <li>
          <router-link
            :to="dashboardRoute"
            @click="closeSideNav"
          >
            Dashboard
          </router-link>
        </li>
      </ul>

      <!-- Logout -->
      <div class="side-nav-logout">
        <button
          class="logout-btn"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- =====================================================
         MAIN APPLICATION
    ====================================================== -->
    <main class="main-content">
      <div class="safehome-page">

        <!-- =================================================
             HERO
        ================================================== -->
        <section class="hero">
          <div class="hero-content">
            <span class="badge">
              <AppIcon name="home" /> SafeHomeZA
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

        <!-- =================================================
             EMERGENCY SERVICES
        ================================================== -->
        <section class="emergency-section">
          <div class="emergency-card">
            <div class="emergency-text">
              <span class="emergency-badge">
                <AppIcon name="alert" /> URGENT HELP
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
                  <AppIcon :name="item.icon" /> {{ item.name }}
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

        <!-- =================================================
             SERVICES
        ================================================== -->
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
                <AppIcon :name="service.icon" />
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

        <!-- =================================================
             PROVIDERS
        ================================================== -->
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

          <div
            v-if="loadingProviders"
            class="providers-loading"
          >
            Loading providers...
          </div>

          <div
            v-else-if="providers.length === 0"
            class="providers-empty"
          >
            <h3>No providers found</h3>

            <p>
              There are currently no providers available for this service.
            </p>
          </div>

          <div
            v-else
            class="providers-grid"
          >
            <div
              v-for="provider in providers"
              :key="provider.id"
              class="provider-card"
            >
              <div class="provider-top">
                <div class="provider-avatar">
                  {{ provider.full_name?.charAt(0) || '?' }}
                </div>

                <div class="provider-info">
                  <h3>
                    {{ provider.full_name }}
                  </h3>

                  <div class="rating">
                    <AppIcon name="star" /> {{ provider.rating ?? 'N/A' }}

                    <span>
                      ({{ provider.rating_count ?? 0 }} reviews)
                    </span>
                  </div>
                </div>

                <span
                  v-if="provider.is_verified"
                  class="verified"
                >
                  <AppIcon name="check" /> Verified
                </span>
              </div>

              <p class="provider-bio">
                {{ provider.bio || 'Professional service provider.' }}
              </p>

              <!-- PROBLEM DETAILS -->
              <div class="problem-details">
                <label class="problem-label">
                  Describe your problem
                </label>

                <textarea
                  v-model="getQuoteForm(provider.id).description"
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
                      @change="
                        handlePhotoUpload(
                          provider.id,
                          $event
                        )
                      "
                    />

                    <span
                      v-if="
                        !getQuoteForm(provider.id).photoPreview
                      "
                    >
                      <AppIcon name="upload" /> Add a photo
                    </span>

                    <span v-else>
                      <AppIcon name="check" /> Photo attached
                    </span>
                  </label>

                  <img
                    v-if="
                      getQuoteForm(provider.id).photoPreview
                    "
                    :src="
                      getQuoteForm(provider.id).photoPreview
                    "
                    class="photo-preview"
                    alt="Problem photo preview"
                    @click="removePhoto(provider.id)"
                    title="Click to remove"
                  />
                </div>
              </div>

              <!-- PROVIDER FOOTER -->
              <div class="provider-footer">
                <span class="experience">
                  {{ provider.experience_years ?? 0 }} years experience
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

        <!-- =================================================
             CUSTOMER REVIEWS
        ================================================== -->
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
                  <AppIcon name="star" />
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
import {
  ref,
  reactive,
  computed,
  onMounted
} from 'vue'

import Swal from 'sweetalert2'
import AppIcon from '../components/AppIcon.vue'
import { useRouter } from 'vue-router'
import { session, dashboardRoutes } from '../services/api'

/* =========================================================
   API
========================================================= */

const API_URL = import.meta.env.VITE_API_URL || 'https://campusswap-backend-kk9v.onrender.com/api'


/* =========================================================
   SIDEBAR
========================================================= */

const sideNavOpen = ref(false)
const router = useRouter()
  const userRole = ref(session.get()?.role || '')
const dashboardRoute = computed(() => dashboardRoutes[userRole.value] || '/')

function toggleSideNav() {
  sideNavOpen.value = !sideNavOpen.value

  document.body.style.overflow =
    sideNavOpen.value ? 'hidden' : ''
}

function closeSideNav() {
  sideNavOpen.value = false
  document.body.style.overflow = ''
}

function logout() {
  Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to log out?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      session.clear()
      localStorage.removeItem('isLoggedIn')
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        router.push('/login')
      })
    }
  })
}

function showNotifications() {
  Swal.fire({
    title: 'Notifications',
    text: 'You have 3 new notifications!',
    icon: 'info',
    confirmButtonText: 'Okay'
  })
}


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

const loadingServices = ref(false)
const loadingProviders = ref(false)


/* =========================================================
   SERVICES
========================================================= */

const services = ref([])
const fallbackServices = [
  { id: 1, name: 'Plumbing' },
  { id: 2, name: 'Electrical' },
  { id: 3, name: 'Cleaning' },
  { id: 4, name: 'Gardening' },
  { id: 5, name: 'Security' },
  { id: 6, name: 'Handyman' }
]


/* =========================================================
   SERVICE ICONS
========================================================= */

function getServiceIcon(serviceName) {
  const icons = {
    Plumbing: 'wrench',
    Electrical: 'tools',
    Cleaning: 'settings',
    Gardening: 'settings',
    Security: 'shield',
    Handyman: 'tools'
  }

  return icons[serviceName] || 'wrench'
}


/* =========================================================
   SERVICE DESCRIPTIONS
========================================================= */

function getServiceDescription(serviceName) {
  const descriptions = {
    Plumbing:
      'Leaks, pipes, blocked drains and repairs.',

    Electrical:
      'Electrical repairs, installations and maintenance.',

    Cleaning:
      'Reliable home and deep cleaning services.',

    Gardening:
      'Lawn care, landscaping and garden maintenance.',

    Security:
      'Home security and protection services.',

    Handyman:
      'General repairs, installations and maintenance.'
  }

  return (
    descriptions[serviceName] ||
    'Professional home maintenance services.'
  )
}


/* =========================================================
   FETCH SERVICE TYPES FROM BACKEND
========================================================= */

async function fetchServices() {
  loadingServices.value = true

  try {
    const response = await fetch(
      `${API_URL}/service-types`
    )

    if (!response.ok) {
      throw new Error(
        `Service types request failed: ${response.status}`
      )
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(
        result.message || 'Failed to load service types.'
      )
    }

    services.value = (result.data || []).map((service) => ({
      id: service.id,
      name: service.name,
      icon: getServiceIcon(service.name),
      description: getServiceDescription(service.name)
    }))
    if (!services.value.length) {
      services.value = fallbackServices.map((service) => ({
        ...service,
        icon: getServiceIcon(service.name),
        description: getServiceDescription(service.name)
      }))
    }

  } catch (error) {
    console.error(
      'Error fetching service types:',
      error
    )

    // Keep SafeHome usable when the API is sleeping or unavailable.
    services.value = fallbackServices.map((service) => ({
      ...service,
      icon: getServiceIcon(service.name),
      description: getServiceDescription(service.name)
    }))

  } finally {
    loadingServices.value = false
  }
}


/* =========================================================
   SELECTED SERVICE
========================================================= */

const selectedService = computed(() => {
  return (
    services.value.find(
      (service) =>
        service.id === selectedServiceId.value
    ) || null
  )
})


/* =========================================================
   EMERGENCY SERVICES
========================================================= */

const emergencyServices = [
  {
    name: 'Emergency Plumbing',
    serviceName: 'Plumbing',
    serviceTypeId: 1,
    icon: 'tools'
  },
  {
    name: 'Emergency Electrical',
    serviceName: 'Electrical',
    serviceTypeId: 2,
    icon: 'alert'
  },
  {
    name: 'Locksmith',
    serviceName: 'Security',
    serviceTypeId: 5,
    icon: 'lock'
  },
  {
    name: 'Security',
    serviceName: 'Security',
    serviceTypeId: 5,
    icon: 'shield'
  }
]


/* =========================================================
   PROVIDERS
========================================================= */

const providers = ref([])


/* =========================================================
   QUOTE REQUEST FORMS
========================================================= */

const quoteForms = reactive({})


/* =========================================================
   CREATE QUOTE FORM FOR PROVIDER
========================================================= */

function createQuoteForm(providerId) {
  if (!quoteForms[providerId]) {
    quoteForms[providerId] = {
      description: '',
      photo: null,
      photoPreview: null
    }
  }

  return quoteForms[providerId]
}


/* =========================================================
   GET QUOTE FORM
========================================================= */

function getQuoteForm(providerId) {
  return createQuoteForm(providerId)
}


/* =========================================================
   FETCH PROVIDERS FROM BACKEND
========================================================= */

async function fetchProviders(serviceName = '') {
  loadingProviders.value = true

  try {
    let url = `${API_URL}/providers`

    if (serviceName) {
      url += `?service=${encodeURIComponent(serviceName)}`
    }

    console.log(
      'Fetching providers from:',
      url
    )

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Providers request failed: ${response.status}`
      )
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(
        result.message || 'Failed to load providers.'
      )
    }

    providers.value = result.data || []

    /*
     * Create a quote form for every provider
     * returned from the database.
     */
    providers.value.forEach((provider) => {
      createQuoteForm(provider.id)
    })

  } catch (error) {
    console.error(
      'Error fetching providers:',
      error
    )

    // Backend is unavailable: do not present dummy providers as live listings.
    providers.value = []


  } finally {
    loadingProviders.value = false
  }
}


/* =========================================================
   FIND PROVIDERS
========================================================= */

async function findProviders() {
  if (!selectedServiceId.value) {
    Swal.fire({
      title: 'Select a service',
      text:
        'Please choose a service before finding providers.',
      icon: 'warning',
      confirmButtonText: 'Okay'
    })

    return
  }

  if (!selectedService.value) {
    Swal.fire({
      title: 'Service not found',
      text:
        'The selected service could not be found.',
      icon: 'error',
      confirmButtonText: 'Okay'
    })

    return
  }

  isEmergencyMode.value = false
  showProviders.value = true

  await fetchProviders(
    selectedService.value.name
  )

  if (providers.value.length > 0) {
    Swal.fire({
      title: 'Providers Found!',
      text:
        `We found ${providers.value.length} provider(s) for ${selectedService.value.name}.`,
      icon: 'success',
      confirmButtonText: 'View Providers'
    })
  }
}


/* =========================================================
   SELECT NORMAL SERVICE
========================================================= */

async function selectService(service) {
  selectedServiceId.value = service.id
  isEmergencyMode.value = false
  showProviders.value = true

  await fetchProviders(service.name)
}


/* =========================================================
   SELECT EMERGENCY SERVICE
========================================================= */

async function selectEmergencyService(service) {
  selectedServiceId.value =
    service.serviceTypeId

  isEmergencyMode.value = true
  showProviders.value = true

  await fetchProviders(service.serviceName)
}


/* =========================================================
   FIND EMERGENCY HELP
========================================================= */

async function findEmergencyHelp() {
  isEmergencyMode.value = true

  if (!selectedServiceId.value) {
    selectedServiceId.value =
      emergencyServices[0].serviceTypeId
  }

  showProviders.value = true

  const service = services.value.find(
    (item) =>
      item.id === selectedServiceId.value
  )

  if (service) {
    await fetchProviders(service.name)
  } else {
    await fetchProviders('Plumbing')
  }

  if (providers.value.length > 0) {
    Swal.fire({
      title: 'Emergency Help',
      text:
        'Emergency providers are now being shown.',
      icon: 'warning',
      confirmButtonText: 'View Providers'
    })
  }
}


/* =========================================================
   PHOTO UPLOAD
========================================================= */

function handlePhotoUpload(providerId, event) {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    Swal.fire({
      title: 'Invalid file',
      text:
        'Please upload an image file.',
      icon: 'error',
      confirmButtonText: 'Okay'
    })

    event.target.value = ''

    return
  }

  const form = createQuoteForm(providerId)

  form.photo = file

  const reader = new FileReader()

  reader.onload = (e) => {
    form.photoPreview =
      e.target.result

    Swal.fire({
      title: 'Photo Added!',
      text:
        'Your problem photo has been attached successfully.',
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
    text:
      'Are you sure you want to remove this photo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it',
    cancelButtonText: 'Keep photo'
  }).then((result) => {
    if (result.isConfirmed) {
      const form =
        createQuoteForm(providerId)

      form.photo = null
      form.photoPreview = null

      Swal.fire({
        title: 'Removed!',
        text:
          'The photo has been removed.',
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
  const form =
    createQuoteForm(provider.id)

  let message =
    `Quote request prepared for ${provider.full_name}`

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
      `\nPhoto attached: ${form.photo.name}`
  }

  if (isEmergencyMode.value) {
    message +=
      `\n\nPriority: EMERGENCY`
  }

  /*
   * IMPORTANT:
   * We are not POSTing the service request yet because
   * the login backend is still being completed.
   *
   * The create-service endpoint requires:
   * student_id
   *
   * We will connect this once the login backend gives
   * the frontend the authenticated user's database ID.
   */

  Swal.fire({
    title:
      isEmergencyMode.value
        ? 'Emergency Quote Ready'
        : 'Quote Ready',

    text: message,

    icon: 'success',

    confirmButtonText: 'Okay'
  })
}


/* =========================================================
   LOAD DATA WHEN PAGE OPENS
========================================================= */

onMounted(async () => {
  await fetchServices()
})
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
  width: 100%;
  margin-left: 0;
  min-height: 100vh;
}

.safehome-page {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
}


/* =========================================================
   TOP BAR
========================================================= */

.top-bar {
  background-color: #0d1b3d;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3);
  flex-wrap: wrap;
  box-sizing: border-box;
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
  color: #fff;
  line-height: 1;
}

.brand-link {
  text-decoration: none;
}

.brand {
  color: #fff;
  font-size: 22px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.brand .green-text,
.green-text {
  color: #2e7d5a;
}


/* =========================================================
   SEARCH BAR
========================================================= */

.top-center {
  flex: 1;
  min-width: 160px;
  max-width: 520px;
}

.search-wrap {
  display: flex;
  align-items: center;
  background-color:
    rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 6px 16px;
  border:
    1px solid rgba(255, 255, 255, 0.08);
}

.search-wrap:hover,
.search-wrap:focus-within {
  background-color:
    rgba(255, 255, 255, 0.20);
  border-color:
    rgba(245, 185, 65, 0.4);
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 8px 0;
  width: 100%;
}

.search-input::placeholder {
  color: #9ca3af;
}


/* =========================================================
   TOP RIGHT
========================================================= */

.top-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 15px;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  color: #fff;
  transition: color 0.3s ease;
}

.notification-bell:hover {
  color: #f5b941;
}

.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #ff4d4f;
  border-radius: 50%;
  border:
    2px solid #0d1b3d;
}

.profile-pic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5b941;
  color: #0d1b3d;
  font-weight: 700;
  font-size: 14px;
  border: none;
  box-shadow: none;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* =========================================================
   SIDE NAV OVERLAY
========================================================= */

.side-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:
    rgba(0, 0, 0, 0.5);
  z-index: 200;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.side-overlay-open {
  opacity: 1;
  visibility: visible;
}


/* =========================================================
   SIDE NAV
========================================================= */

.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: #0d1b3d;
  z-index: 300;
  transform: translateX(-100%);
  transition:
    transform 0.3s ease;
  padding: 20px 24px;
  box-shadow:
    4px 0 16px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.side-nav-open {
  transform: translateX(0);
}


/* =========================================================
   SIDE NAV HEADER
========================================================= */

.side-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom:
    1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.side-nav-header h3 {
  color: #fff;
  font-size: 20px;
  margin: 0;
}

.close-side-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
}

.close-side-btn:hover {
  color: #f5b941;
}


/* =========================================================
   SIDE NAV LINKS
========================================================= */

.side-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
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
  border-left:
    3px solid transparent;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease;
}

.side-nav-links li a:hover {
  background-color:
    rgba(245, 185, 65, 0.12);
  color: #f5b941;
  border-left-color:
    #f5b941;
}


/* =========================================================
   LOGOUT
========================================================= */

.side-nav-logout {
  margin-top: auto;
  padding-top: 20px;
  border-top:
    1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  background: transparent;
  border:
    2px solid #f5b941;
  color: #f5b941;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition:
    all 0.3s ease;
}

.logout-btn:hover {
  background-color: #f5b941;
  color: #0d1b3d;
  transform: translateY(-2px);
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
   BUTTONS
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
  margin:
    0 0 8px;
}

.emergency-text p {
  margin:
    0 0 16px;
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
   PROVIDER LOADING / EMPTY
========================================================= */

.providers-loading,
.providers-empty {
  width: 100%;
  box-sizing: border-box;
  background: white;
  border:
    1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
}

.providers-loading {
  color: #64748b;
}

.providers-empty h3 {
  margin:
    0 0 8px;
  color: #1e293b;
}

.providers-empty p {
  margin: 0;
  color: #64748b;
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
  .main-content {
    width: 100%;
    margin-left: 0;
  }

  .top-center {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .top-right {
    display: flex;
  }

  .top-bar {
    padding:
      10px 20px;
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
  .side-nav {
    width: 280px;
  }

  .hero h1 {
    font-size: 38px;
  }

  .hero p {
    font-size: 16px;
  }

  .section-heading h2 {
    font-size: 28px;
  }

  .brand {
    font-size: 19px;
  }
}

</style>
