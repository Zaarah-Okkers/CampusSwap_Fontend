<!-- 
  i will have the login for the 
 1.students
 2. service providers
 3. admin
 4. res manager
 all on one page but differerent sections 
 -->


<template>
  <div class="login-page" :class="`login-${role}`">

    
    <div class="login-left">

      <div class="logo-area">

        <h2 class="logo-text">
          CampusSwap

          <span class="green-text">
            SA
          </span>
        </h2>

      </div>

      <h1 class="hero-title">
        One Campus. 

        <span class="gold-text">
          Endless Possibilities.
        </span> All in One Place.
      </h1>

      <p class="hero-desc">
        Trade textbooks, book verified repairs, and safely connect with students
        from your own campus. Escrow protection guarantees secure transactions.
      </p>

      <!-- Trust badges -->

      <div class="trust-badges">

        <div class="badge">

          <span class="badge-icon">
            <AppIcon name="shield" />
          </span> EduID Verified

        </div>

        <div class="badge">

          <span class="badge-icon">
            <AppIcon name="lock" />
          </span> Ozow Secure Escrow

        </div>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="login-right">
      <div class="form-wrapper">
        
        <!-- Mobile Logo Header -->
        <div class="mobile-logo-header">

          <div class="mobile-logo-circle">

            <span class="mobile-user-icon">
              <AppIcon name="user" />
            </span>

          </div>

          <h2 class="mobile-brand">
            
            CampusSwap

            <span class="green-text">
              SA
            </span>

          </h2>

          <p class="mobile-tagline">
            ONE CAMPUS. ENDLESS POSSIBILITIES.
          </p>

        </div>

        <!-- Role Toggle - 4 BUTTONS -->
        <div v-if="!dedicatedRole" class="role-toggle">

          <button 
            :class="{ 'role-btn-active': role === 'student' }" 
            class="role-btn" 
            @click="role = 'student'"
          >
            Student
          </button>

          <button 
            :class="{ 'role-btn-active': role === 'provider' }" 
            class="role-btn" 
            @click="openRoleLogin('provider')"
          >
            Provider
          </button>

          <button 
            :class="{ 'role-btn-active': role === 'admin' }" 
            class="role-btn" 
            @click="openRoleLogin('admin')"
          >
            Admin
          </button>

          <button 
            :class="{ 'role-btn-active': role === 'resmanager' }" 
            class="role-btn" 
            @click="openRoleLogin('resmanager')"
          >
            Res Mgr
          </button>

        </div>

        <h2 class="form-title">
          {{ getRoleTitle() }}
        </h2>

        <p class="form-subtitle">
          {{ getRoleSubtitle() }}
        </p>

        <!-- Institution Selection -->

        <div v-if="role === 'student' || role === 'resmanager'" class="form-group">

          <label>
            {{ getInstitutionLabel() }}
          </label>

          <div class="select-wrap">

            <span class="input-icon">
              <AppIcon name="building" />
            </span>

            <select v-model="selectedInstitution" class="form-input">
              <option value="" disabled>
                Select your institution
              </option>
              
              <!-- Students and residence managers select a university. -->
              <template 
              v-if="role === 'student' || role === 'resmanager'">

                <optgroup v-for="(unis, province) in universities" :key="province" :label="province">
                  <option v-for="uni in unis" :key="uni" :value="uni">
                    {{ uni }}
                  </option>

                </optgroup>
              </template>
              
            </select>
          </div>
        </div>

        <!-- Email -->

        <div class="form-group">

          <label>
            {{ getEmailLabel() }}
          </label>

          <div class="input-wrap">
            <input 
              v-model="email" 
              type="email" 
              :placeholder="getEmailPlaceholder()" 
              class="form-input"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">

          <label>
            Password
          </label>

          <div class="input-wrap">
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter your password" 
              class="form-input"
            />
          </div>
        </div>

        <div class="form-options">

          <a href="#" @click.prevent="showPasswordResetNotice" class="forgot-link">
            Forgot Password? Not a problem bestie:)
          </a>
        </div>
              
        <!-- Submit Button -->

        <button class="btn btn-primary" @click="handleLogin">
          {{ getSubmitLabel() }}
        </button>
        
        <p class="new-user">
          New here? 
          <a href="#" @click.prevent="openRegistration" class="create-account-link">
            Create an account
          </a>
        </p>

        <!-- Quick Test Buttons at the buttom -->
        <div v-if="!dedicatedRole" class="quick-test-section">

          <p style="font-size: 11px; color: #9ca3af; margin-bottom: 8px;">Quick Test Login:</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
            <button @click="quickLogin('student')" class="quick-btn student-btn"><AppIcon name="graduationCap" /> Student</button>
            <button @click="quickLogin('provider')" class="quick-btn provider-btn"><AppIcon name="tools" /> Provider</button>
            <button @click="quickLogin('admin')" class="quick-btn admin-btn"><AppIcon name="dashboard" /> Admin</button>
            <button @click="quickLogin('resmanager')" class="quick-btn resmanager-btn"><AppIcon name="home" /> Res Mgr</button>
          </div>
        </div>

        <!-- Mobile Footer -->
        <div class="mobile-footer">
          <p>
            <AppIcon name="lock" />
            Ozow Escrow Protected 
            &bull; 
            Secured by EduID
          </p>
        </div>

      </div>
    </div>

    <!-- REGISTRATION MODAL  -->

    <div v-if="showRegistration" class="modal-overlay" @click="closeRegistration">

      <div class="modal-content" @click.stop>
        <div class="modal-header">

          <h2>
            Create Your Account
          </h2>

          <button class="modal-close-btn" @click="closeRegistration">
            &times;
          </button>
        </div>

        <div class="modal-body">

          <!-- Role Selection -->

          <div class="form-group">

            <label>
              I am a:
            </label>

            <div class="registration-role-toggle">
              <button 
                :class="{ 'reg-role-active': regData.role === 'student' }" 
                class="reg-role-btn" 
                @click="regData.role = 'student'"
              >
                Student
              </button>

              <button 
                :class="{ 'reg-role-active': regData.role === 'provider' }" 
                class="reg-role-btn" 
                @click="regData.role = 'provider'"
              >
                Provider
              </button>

              <button 
                :class="{ 'reg-role-active': regData.role === 'admin' }" 
                class="reg-role-btn" 
                @click="regData.role = 'admin'"
              >
                Admin
              </button>

              <button 
                :class="{ 'reg-role-active': regData.role === 'resmanager' }" 
                class="reg-role-btn" 
                @click="regData.role = 'resmanager'"
              >
                Res Manager
              </button>

            </div>
          </div>

          <!-- Full Name -->
          <div class="form-group">

            <label>
              Full Name
            </label>

            <input v-model="regData.fullName" type="text" class="form-input" placeholder="Enter your full name" />
          </div>

          <!-- Email -->
          <div class="form-group">

            <label>
              Email Address
            </label>

            <input v-model="regData.email" type="email" class="form-input" placeholder="your.email@example.com" />
          </div>

          <!-- Optional profile detail; not required to create an account. -->

          <div v-if="regData.role === 'student'" class="form-group">
            <label>
              Student Number (optional)
            </label>

            <input v-model="regData.studentNumber" type="text" class="form-input" placeholder="e.g., ST1001" />
          </div>

          <!-- University Selection -->

          <div v-if="regData.role === 'student' || regData.role === 'resmanager'" class="form-group">
            <label>
              University
            </label>

            <div class="select-wrap">

              <span class="input-icon">
                <AppIcon name="building" />
              </span>

              <select v-model="regData.university" class="form-input">

                <option value="" disabled>
                  -- Select Your University --
                </option>

                <optgroup v-for="(unis, province) in universities" :key="province" :label="province">

                  <option v-for="uni in unis" :key="uni" :value="uni">
                    {{ uni }}
                  </option>

                </optgroup>
              </select>
            </div>
          </div>

          <!-- Provider service category -->
          <div v-if="regData.role === 'provider'" class="form-group">
            <label for="provider-service">Primary service offered</label>
            <div class="select-wrap">
              <span class="input-icon"><AppIcon name="tools" /></span>
              <select id="provider-service" v-model="regData.serviceType" class="form-input">
                <option value="" disabled>-- Select a service type --</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="cleaning">Cleaning</option>
                <option value="repairs">Appliance and general repairs</option>
                <option value="carpentry">Carpentry and furniture assembly</option>
                <option value="moving">Moving and delivery help</option>
                <option value="technology">Technology support</option>
                <option value="other">Other campus service</option>
              </select>
            </div>
          </div>

          <!-- Password -->

          <div class="form-group">

            <label>
              Password
            </label>
            
            <input v-model="regData.password" type="password" class="form-input" placeholder="Create a strong password (min 6 chars)" />
          </div>

          <!-- Confirm Password -->

          <div class="form-group">

            <label>
              Confirm Password
            </label>

            <input v-model="regData.confirmPassword" type="password" class="form-input" placeholder="Re-enter your password" />
          </div>

          <!-- Student ID Upload (for students only) -->

          <div v-if="regData.role === 'student'" class="form-group">
            <label>
              Upload Student ID (optional)
            </label>

            <div class="file-upload-wrapper">
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept="image/*" 
                class="file-input" 
                id="student-id-upload"
              />

              <label for="student-id-upload" class="file-upload-label">

                <span v-if="!regData.idFile">
                  <AppIcon name="upload" /> Choose Student ID Image
                </span>

                <span v-else>
                  <AppIcon name="check" /> {{ regData.idFile.name }}
                </span>

              </label>
              <p class="file-hint">
                You may upload a photo of your student ID card for later verification.
              </p>

            </div>
          </div>

          <!-- Verified Badge Preview -->

          <div v-if="regData.role === 'student' && regData.idFile" class="verified-badge-preview">

            <span class="verified-badge">
              Verified Student
            </span>

            <p class="verified-text">
              Your ID will be verified by an admin
            </p>
          </div>

          <!-- Terms -->
          <div class="form-group terms-group">

            <label>
              <input type="checkbox" v-model="regData.agreeTerms" />
              I agree to the 
              <router-link :to="{ name: 'terms' }">
                Terms of Service
              </router-link> and
              <router-link :to="{ name: 'privacy' }">Privacy Policy</router-link>
            </label>
          </div>

          <!-- Register Button -->
           
          <button class="btn btn-primary" @click="handleRegistration" :disabled="!regData.agreeTerms">
            Create Account
          </button>

          <p class="login-link">
            Already have an account? 
            <a href="#" @click.prevent="closeRegistration" class="create-account-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import AppIcon from '../components/AppIcon.vue'
import { authAPI, roleMap, session } from '@/services/api'

// Role-specific welcome title shown after successful login/registration.
const SUCCESS_MESSAGES = {
  student: 'Certified user moment.',
  service_provider: 'Access granted, chief.',
  admin: 'Level unlocked.',
  res_manager: 'Player 1 has entered.'
}

export default {
  name: 'LoginPage',
  components: { AppIcon },
  created() {
    const role = this.$route.meta.loginRole || this.$route.query.role
    if (role) this.role = role
  },
  watch: {
    '$route'(to) {
      const role = to.meta.loginRole || to.query.role || 'student'
      this.role = role
      this.email = ''
      this.password = ''
      this.selectedInstitution = ''
    }
  },
  data() {
    return {
      sideNavOpen: false,
      role: 'student',
      email: '',
      password: '',
      selectedInstitution: '',
      showRegistration: false,
      regData: {
        role: 'student', fullName: '', email: '', studentNumber: '',
        university: '', company: '', serviceType: '',
        password: '', confirmPassword: '', idFile: null, agreeTerms: false
      },
      registeredUsers: [],
      universities: {
        'Western Cape': [
          'University of Cape Town (UCT)',
          'University of the Western Cape (UWC)',
          'Stellenbosch University (SU)',
          'Cape Peninsula University of Technology (CPUT)',
          'University of South Africa (UNISA) Cape Town Branch'
        ],
        'Gauteng': [
          'University of the Witwatersrand (Wits)',
          'University of Pretoria (UP)',
          'University of Johannesburg (UJ)',
          'Tshwane University of Technology (TUT)',
          'University of South Africa (UNISA) main branch'
        ],
        'KwaZulu-Natal': [
          'University of KwaZulu-Natal (UKZN)',
          'Durban University of Technology (DUT)',
          'Mangosuthu University of Technology (MUT)'
        ],
        'Eastern Cape': [
          'Rhodes University',
          'Nelson Mandela University (NMU)',
          'Walter Sisulu University (WSU)'
        ],
        'Free State': [
          'University of the Free State (UFS)',
          'Central University of Technology (CUT)'
        ],
        'North West': ['North-West University (NWU)'],
        'Limpopo': ['University of Limpopo (UL)', 'University of Venda (UNIVEN)'],
        'Mpumalanga': ['University of Mpumalanga (UMP)'],
        'Northern Cape': ['Sol Plaatje University (SPU)']
      }
    }
  },
  computed: {
    dedicatedRole() {
      return Boolean(this.$route.meta.loginRole || this.$route.query.role)
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNavOpen = !this.sideNavOpen
      document.body.style.overflow = this.sideNavOpen ? 'hidden' : ''
    },
    closeSideNav() {
      this.sideNavOpen = false
      document.body.style.overflow = ''
    },

    // ===== ROLE TEXT HELPERS =====
    getRoleTitle() {
      return {
        student: 'Student Verification',
        provider: 'Service Provider Verification',
        admin: 'Admin Access',
        resmanager: 'Residence Manager Access'
      }[this.role] || 'Verification'
    },
    getRoleSubtitle() {
      return {
        student: "Verify using your academic email to prove you're a student.",
        provider: 'Verify using your professional work email.',
        admin: 'Platform administration access. Please use your admin credentials.',
        resmanager: 'Residence management access. Please use your credentials.'
      }[this.role] || 'Please verify your credentials.'
    },
    getInstitutionLabel() {
      return {
        student: 'Select Your Tertiary Institution',
        provider: 'Select Your Company / Organization',
        admin: 'Select Your Institution',
        resmanager: 'Select Your Institution'
      }[this.role] || 'Select Institution'
    },
    getEmailLabel() {
      return {
        student: 'Institution Email (Student Verification)',
        provider: 'Work Email',
        admin: 'Admin Email',
        resmanager: 'Residence Manager Email'
      }[this.role] || 'Email'
    },
    getEmailPlaceholder() {
      return {
        student: 'thabo.m@myuct.ac.za',
        provider: 'info@capeplumbing.co.za',
        admin: 'lerato.admin@campusswap.co.za',
        resmanager: 'resmanager.uct@campusswap.co.za'
      }[this.role] || 'Enter your email'
    },
    getSubmitLabel() {
      return {
        student: 'Verify & Enter CampusSwap',
        provider: 'Enter Provider Workspace',
        admin: 'Enter Admin Console',
        resmanager: 'Enter Residence Workspace'
      }[this.role] || 'Continue'
    },

    openRoleLogin(role) {
      this.$router.push(`/login/${role}`)
    },

    persistLogin(user, role) {
      const storeRole = roleMap[role] || user.role || role
      const displayName = user.full_name || user.fullName || user.name || 'CampusSwap User'
      const account = {
        id: user.id ?? user.email,
        name: displayName,
        full_name: displayName,
        email: user.email,
        role: storeRole,
        avatar: user.avatar_url || user.avatar ||
          `https://placehold.co/100x100/6C5CE7/FFFFFF?text=${encodeURIComponent(displayName.charAt(0))}`,
        university: user.university_name || user.university || '',
        studentNumber: user.student_number || user.studentNumber || '',
        verified: user.is_verified ?? user.verified ?? true,
        online: true,
        isPremium: user.is_premium ?? user.isPremium ?? false
      }
      this.$store.commit('user/setCurrentUser', account)
      this.$store.commit('user/setLoggedIn', true)
      session.save(account)
      localStorage.setItem('isLoggedIn', 'true')
    },

    // ===== SMALL NOTICES =====
    showPasswordResetNotice() {
      Swal.fire({ icon: 'success', title: 'Check Your Email', text: 'Password reset link sent!', confirmButtonColor: '#2e7d5a' })
    },
    showTermsNotice() {
      Swal.fire({ icon: 'info', title: 'Terms of Service', text: 'Terms and conditions coming soon!', confirmButtonColor: '#f5b941' })
    },
    showPrivacyNotice() {
      Swal.fire({ icon: 'info', title: 'Privacy Policy', text: 'Privacy policy coming soon!', confirmButtonColor: '#f5b941' })
    },

    // ===== REGISTRATION =====
    openRegistration() {
      this.showRegistration = true
      this.regData = {
        role: 'student', fullName: '', email: '', studentNumber: '',
        university: '', company: '', serviceType: '',
        password: '', confirmPassword: '', idFile: null, agreeTerms: false
      }
      document.body.style.overflow = 'hidden'
    },
    closeRegistration() {
      this.showRegistration = false
      document.body.style.overflow = ''
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please upload an image file.', confirmButtonColor: '#d33' })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({ icon: 'error', title: 'File Too Large', text: 'File size must be less than 5MB.', confirmButtonColor: '#d33' })
        return
      }
      this.regData.idFile = file
    },

    async handleRegistration() {
      // Validations — all same as before
      if (!this.regData.fullName) return this._warn('Please enter your full name.')
      if (!this.regData.email) return this._warn('Please enter your email address.')
      if (!this.regData.email.includes('@')) return this._err('Please enter a valid email address.')
      if ((this.regData.role === 'student' || this.regData.role === 'resmanager') && !this.regData.university) {
        return this._warn('Please select your university.')
      }
      if (this.regData.role === 'provider' && !this.regData.serviceType) {
        return this._warn('Select the primary service you will provide.')
      }
      if (!this.regData.password) return this._warn('Please create a password.')
      if (this.regData.password.length < 6) return this._err('Password must be at least 6 characters long.')
      if (this.regData.password !== this.regData.confirmPassword) return this._err('Passwords do not match.')
      if (!this.regData.agreeTerms) return this._warn('Please agree to the Terms of Service and Privacy Policy.')

      // Try the real backend first.
      try {
        await authAPI.register({
          full_name: this.regData.fullName,
          email: this.regData.email,
          password: this.regData.password,
          role: this.regData.role,
          university: this.regData.university || null,
          student_number: this.regData.studentNumber || null,
          company: this.regData.company || null
        })

        // Auto-login
        try {
          const login = await authAPI.login(this.regData.email, this.regData.password, this.regData.role)
          if (login?.user) {
            this.persistLogin(login.user, login.user.role)
            const routes = {
              student: '/student-dashboard', service_provider: '/provider-dashboard',
              admin: '/admin', res_manager: '/resmanager-dashboard'
            }
            await Swal.fire({
              icon: 'success',
              title: SUCCESS_MESSAGES[login.user.role] || 'Welcome to CampusSwap!',
              text: `Registered as ${login.user.full_name}.`,
              timer: 1800, showConfirmButton: false
            })
            this.closeRegistration()
            this.$router.push(routes[login.user.role] || '/')
            return
          }
        } catch (loginErr) {
          console.warn('[register] auto-login failed:', loginErr.message)
        }

        await Swal.fire({
          icon: 'success', title: 'Account Created',
          text: 'Your account was created. Please log in.',
          confirmButtonColor: '#2e7d5a'
        })
        this.email = this.regData.email
        this.closeRegistration()
        return
      } catch (apiErr) {
        if (/already registered|ER_DUP_ENTRY/i.test(apiErr.message)) {
          return this._err('This email is already registered. Please login instead.')
        }
        console.warn('[register] API register failed, using in-memory:', apiErr.message)
      }

      // In-memory fallback
      const existingUser = this.registeredUsers.find(u => u.email === this.regData.email)
      if (existingUser) return this._err('This email is already registered in this browser session.')

      this.registeredUsers.push({
        role: this.regData.role, fullName: this.regData.fullName, email: this.regData.email,
        studentNumber: this.regData.studentNumber || '', university: this.regData.university || '',
        serviceType: this.regData.serviceType || '', password: this.regData.password,
        idFile: this.regData.idFile ? this.regData.idFile.name : null,
        registeredAt: new Date().toLocaleString()
      })

      await Swal.fire({
        icon: 'success',
        title: SUCCESS_MESSAGES[roleMap[this.regData.role]] || 'Registration Successful!',
        html: `<p><strong>Welcome, ${this.regData.fullName}!</strong></p>
          <p>Role: ${this.regData.role}<br>Email: ${this.regData.email}</p>
          <p>You can now log in with your credentials.
        </p>`,
        confirmButtonColor: '#2e7d5a'
      })

      this.role = this.regData.role
      this.email = this.regData.email
      this.password = this.regData.password
      this.selectedInstitution = this.regData.university || ''
      this.closeRegistration()
    },

    // Tiny wrappers for the alert styles we reuse a lot.
    _warn(text) { return Swal.fire({ icon: 'warning', title: 'Missing Information', text, confirmButtonColor: '#f5b941' }) },
    _err(text) { return Swal.fire({ icon: 'error', title: 'Invalid Input', text, confirmButtonColor: '#d33' }) },


    // ===== LOGIN =====
    async handleLogin() {

      if (!this.email || !this.password) {
        await Swal.fire({ icon: 'warning', title: 'Incomplete Form', text: 'Please enter your email and password.', confirmButtonColor: '#f5b941' })
        return
      }

      // 1. Real backend first.
      try {

        const result = await authAPI.login(this.email, this.password, this.role)
        const apiUser = result?.user
        if (apiUser && apiUser.role) {
          this.persistLogin(apiUser, apiUser.role)
          const routes = {
            student: '/student-dashboard',
            service_provider: '/provider-dashboard',
            admin: '/admin',
            res_manager: '/resmanager-dashboard'
          }

          await Swal.fire({
            icon: 'success',
            title: SUCCESS_MESSAGES[apiUser.role] || 'Login Successful!',
            text: `Logged in as ${apiUser.full_name || apiUser.email}`,
            timer: 1800, showConfirmButton: false
          })
          this.$router.push(routes[apiUser.role] || '/')
          return
        }
      } 

      catch (apiErr) {
        console.warn('[login] API login failed:', apiErr.message)
        // Fall through to demo fallback.
      }

      // 2. In-memory accounts created this session.
      const registeredUser = this.registeredUsers.find(u => u.email === this.email && u.password === this.password)

      if (registeredUser) {

        this.persistLogin(registeredUser, registeredUser.role)
        const routes = {
          student: '/student-dashboard', provider: '/provider-dashboard',
          admin: '/admin', resmanager: '/resmanager-dashboard'
        }

        await Swal.fire({

          icon: 'success',
          title: SUCCESS_MESSAGES[roleMap[registeredUser.role]] || 'Welcome back!',
          text: `Logged in as ${registeredUser.fullName}`,
          timer: 1800, showConfirmButton: false
        })

        this.$router.push(routes[registeredUser.role] || '/student-dashboard')
        return
      }

      // 3. Built-in demo fallback (offline).
      const demoCredentials = {
        student:    { email: 'thabo.m@myuct.ac.za',             password: 'student123',  route: '/student-dashboard' },
        provider:   { email: 'info@capeplumbing.co.za',         password: 'provider123', route: '/provider-dashboard' },
        admin:      { email: 'lerato.admin@campusswap.co.za',   password: 'admin123',    route: '/admin' },
        resmanager: { email: 'resmanager.uct@campusswap.co.za', password: 'res123',      route: '/resmanager-dashboard' }
      }
      const creds = demoCredentials[this.role]

      if (this.email === creds.email && this.password === creds.password) {

        this.$store.commit('user/loginAsRole', this.role)
        this.$store.commit('user/setLoggedIn', true)
        session.save(this.$store.getters['user/currentUser'])
        localStorage.setItem('isLoggedIn', 'true')

        await Swal.fire({

          icon: 'success',
          title: SUCCESS_MESSAGES[roleMap[this.role]] || 'Login Successful!',
          text: 'Demo login successful!',
          timer: 1800, showConfirmButton: false
        })

        this.$router.push(creds.route)
        return
      }

      // 4. Nothing matched.
      const roleNames = {
        student: 'Student', provider: 'Service Provider',
        admin: 'Administrator', resmanager: 'Residence Manager'
      }
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        html: `<p>Invalid ${roleNames[this.role]} credentials.</p>
               <p><strong>Demo login:</strong><br>
               Email: ${creds.email}<br>
               Password: ${creds.password}</p>`,
        confirmButtonColor: '#d33'
      })
    },

    // ===== QUICK TEST LOGIN =====
    async quickLogin(role) {
      this.role = role

      const credentials = {
        student:    { email: 'thabo.m@myuct.ac.za',             password: 'student123',  institution: 'University of Cape Town (UCT)' },
        provider:   { email: 'info@capeplumbing.co.za',         password: 'provider123', institution: '' },
        admin:      { email: 'lerato.admin@campusswap.co.za',   password: 'admin123',    institution: '' },
        resmanager: { email: 'resmanager.uct@campusswap.co.za', password: 'res123',      institution: 'University of Cape Town (UCT)' }
      }
      const creds = credentials[role]
      this.email = creds.email
      this.password = creds.password
      this.selectedInstitution = creds.institution

      await Swal.fire({ icon: 'info', title: 'Quick Login', text: `Logging in as ${role}...`, timer: 600, showConfirmButton: false })
      this.handleLogin()
    },

    async setAdminLogin() {
      this.role = 'admin'
      this.email = 'lerato.admin@campusswap.co.za'
      this.password = 'admin123'
      this.selectedInstitution = ''
      await Swal.fire({ icon: 'info', title: 'Admin Login', text: 'Logging in as Administrator...', timer: 600, showConfirmButton: false })
      this.handleLogin()
    }
  }
}

</script>

<style scoped>
/* Entire Page Layout */
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0d1b3d;
  color: #333;
}

/* Role selection keeps the original CampusSwap visual identity. */
.login-provider .login-right, .login-admin .login-right, .login-resmanager .login-right { border-top: 4px solid #2e7d5a; }
.login-provider .btn-primary, .login-admin .btn-primary, .login-resmanager .btn-primary { background: #2e7d5a; color: #ffffff; }
.login-provider .gold-text, .login-admin .gold-text, .login-resmanager .gold-text { color: #f5b941; }

/* ---------------- LEFT SIDE (Desktop) ---------------- */
.login-left {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.login-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 27, 61, 0.84);
}

.logo-area {
  position: absolute;
  top: 40px;
  left: 60px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.green-text {
  color: #2e7d5a;
}

.gold-text {
  color: #f5b941;
}

.hero-title {
  position: relative;
  z-index: 10;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
}

.hero-desc {
  position: relative;
  z-index: 10;
  font-size: 18px;
  color: #d1d5db;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 40px;
}

.trust-badges {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 20px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ddd;
}

.badge-icon {
  font-size: 18px;
  color: #f5b941;
}

/* ---------------- RIGHT SIDE ---------------- */
.login-right {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.form-wrapper {
  max-width: 400px;
  width: 100%;
}

/* Mobile Logo Header - Hidden on Desktop */
.mobile-logo-header {
  display: none;
}

/* Role Toggle */
.role-toggle {
  display: flex;
  background-color: #f0f2f5;
  border-radius: 30px;
  padding: 4px;
  margin-bottom: 30px;
  gap: 2px;
  flex-wrap: wrap;
}

.role-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 0;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  min-width: 60px;
}

.role-btn-active {
  background-color: #f5b941;
  color: #0d1b3d;
}

/* Form Styles */
.form-title {
  color: #0d1b3d;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.form-subtitle {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0d1b3d;
  margin-bottom: 8px;
}

.form-options {
  text-align: right;
  margin-bottom: 15px;
}

.select-wrap,
.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.forgot-link {
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
}

.forgot-link:hover {
  color: #2e7d5a;
  text-decoration: underline;
}

.form-input:focus {
  outline: none;
  border-color: #00a6a6;
}

select.form-input {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path d="M1 4l5 5 5-5z" fill="%2364748b"/></svg>');
  background-repeat: no-repeat;
  background-position: right 16px center;
}

/* Buttons */
.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.15s ease;
}

.btn-primary {
  background-color: #f5b941;
  color: #0d1b3d;
}

.btn-primary:hover:not(:disabled) {
  background-color: #e0a330;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Footer link */
.new-user {
  margin-top: 24px;
  text-align: center;
  font-size: 15px;
  color: #64748b;
}

.create-account-link {
  color: #2e7d5a;
  font-weight: 700;
  text-decoration: none;
}

.create-account-link:hover {
  text-decoration: underline;
}

/* Hidden Admin Link */
.admin-link {
  margin-top: 10px;
  text-align: center;
}

.hidden-admin-link {
  color: #9ca3af;
  font-size: 12px;
  text-decoration: none;
}

.hidden-admin-link:hover {
  color: #64748b;
  text-decoration: underline;
}

/* Quick Test Buttons */
.quick-test-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.quick-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.quick-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.student-btn {
  background: #2e7d5a;
  color: white;
}

.provider-btn {
  background: #00a6a6;
  color: white;
}

.admin-btn {
  background: #6c4b6a;
  color: white;
}

.resmanager-btn {
  background: #f5b941;
  color: #0d1b3d;
}

/* Mobile Footer */
.mobile-footer {
  display: none;
}

/* ===== MODAL STYLES ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 27, 61, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 2px solid #f0f2f5;
}

.modal-header h2 {
  margin: 0;
  color: #0d1b3d;
  font-size: 24px;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #64748b;
  cursor: pointer;
  padding: 0 8px;
  transition: color 0.3s;
}

.modal-close-btn:hover {
  color: #0d1b3d;
}

.modal-body {
  padding: 24px;
}

.registration-role-toggle {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.reg-role-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.reg-role-btn:hover {
  border-color: #f5b941;
}

.reg-role-active {
  border-color: #f5b941;
  background: #fff8e7;
  color: #0d1b3d;
}

/* File Upload */
.file-upload-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
}

.file-upload-label {
  display: block;
  padding: 12px 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
}

.file-upload-label:hover {
  border-color: #00a6a6;
  background: #f8f9fa;
}

.file-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

/* Verified Badge */
.verified-badge-preview {
  margin-top: 12px;
  padding: 12px;
  background: #f0fdf4;
  border: 2px solid #2e7d5a;
  border-radius: 8px;
  text-align: center;
}

.verified-badge {
  display: inline-block;
  background: #2e7d5a;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.verified-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}

/* Terms */
.terms-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
}

.terms-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2e7d5a;
}

.terms-group a {
  color: #2e7d5a;
  text-decoration: none;
}

.terms-group a:hover {
  text-decoration: underline;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  color: #64748b;
}

.login-link a {
  color: #2e7d5a;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------------- MOBILE & RESPONSIVE STYLES ---------------- */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-left {
    display: none;
  }

  .login-right {
    background-color: #ffffff;
    padding: 20px;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 40px;
  }

  .form-wrapper {
    max-width: 100%;
  }

  /* Show Mobile Header */
  .mobile-logo-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .mobile-logo-circle {
    width: 90px;
    height: 90px;
    background-color: #0d1b3d;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
  }

  .mobile-user-icon {
    color: #f5b941;
    font-size: 40px;
  }

  .mobile-brand {
    color: #0d1b3d;
    font-size: 32px;
    margin: 0;
    font-weight: 700;
    text-align: center;
  }

  .mobile-tagline {
    color: #64748b;
    font-size: 13px;
    letter-spacing: 1px;
    margin: 8px 0 0 0;
    text-align: center;
    font-weight: 500;
  }

  .role-toggle {
    margin-bottom: 20px;
    border-radius: 12px;
  }

  .role-btn {
    font-size: 12px;
    padding: 8px 0;
    min-width: 45%;
  }

  .form-title,
  .form-subtitle {
    text-align: center;
  }

  .form-title {
    font-size: 20px;
  }

  .btn-primary {
    border-radius: 12px;
    margin-top: 10px;
  }

  .new-user {
    margin-top: 20px;
  }

  .mobile-footer {
    display: block;
    margin-top: 60px;
    text-align: center;
    font-size: 13px;
    color: #64748b;
  }

  .quick-test-section {
    margin-top: 15px;
    padding-top: 15px;
  }

  .quick-btn {
    font-size: 11px;
    padding: 5px 10px;
  }

  /* Modal mobile */
  .modal-content {
    max-width: 100%;
    margin: 10px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .registration-role-toggle {
    flex-wrap: wrap;
  }

  .reg-role-btn {
    min-width: 45%;
    font-size: 13px;
    padding: 8px;
  }
}

@media (max-width: 380px) {
  .form-input {
    padding: 10px 12px 10px 35px;
    font-size: 14px;
  }

  .input-icon {
    left: 10px;
    font-size: 15px;
  }

  .role-btn {
    font-size: 11px;
    padding: 6px 0;
    min-width: 40%;
  }

  .reg-role-btn {
    font-size: 12px;
    padding: 6px;
    min-width: 40%;
  }
}
</style>
