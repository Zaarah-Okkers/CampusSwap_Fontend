<template>
  <div class="login-page">
    <!-- Left side (Desktop only) -->
    <div class="login-left">
      <div class="logo-area">
        <h2 class="logo-text">CampusSwap<span class="green-text">SA</span></h2>
      </div>

      <h1 class="hero-title">
        One Campus. <span class="gold-text">Endless Possibilities.</span> All in One Place.
      </h1>

      <p class="hero-desc">
        Trade textbooks, book verified repairs, and safely connect with students
        from your own campus. Escrow protection guarantees secure transactions.
      </p>

      <!-- Trust badges -->
      <div class="trust-badges">
        <div class="badge">
          <span class="badge-icon">&#128737;</span> EduID Verified
        </div>
        <div class="badge">
          <span class="badge-icon">&#128274;</span> Ozow Secure Escrow
        </div>
      </div>
    </div>

    <!-- Right side (Form) -->
    <div class="login-right">
      <div class="form-wrapper">
        
        <!-- Mobile Logo Header (Hidden on Desktop) -->
        <div class="mobile-logo-header">
          <div class="mobile-logo-circle">
            <span class="mobile-user-icon">&#128100;</span> <!-- User Icon -->
          </div>
          <h2 class="mobile-brand">CampusSwap<span class="green-text">SA</span></h2>
          <p class="mobile-tagline">ONE CAMPUS. ENDLESS POSSIBILITIES.</p>
        </div>

        <!-- Role Toggle -->
        <div class="role-toggle">
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
            @click="role = 'provider'"
          >
            Service Provider
          </button>
        </div>

        <h2 class="form-title">
          {{ role === 'student' ? 'Student Verification' : 'Provider Verification' }}
        </h2>
        <p class="form-subtitle">
          {{ role === 'student' 
            ? 'To ensure trust, verify using your verified academic email.' 
            : 'To ensure trust, verify using your professional work email.' 
          }}
        </p>

        <!-- Institution Selection -->
        <div class="form-group">
          <label>{{ role === 'student' ? 'Select Your Tertiary Institution' : 'Select Your Company / Organization' }}</label>
          <div class="select-wrap">
            <span class="input-icon">&#127963;</span>
            <select v-model="selectedInstitution" class="form-input">
              <option value="" disabled>-- Select --</option>
              
              <!-- Groups for Students -->
              <template v-if="role === 'student'">
                <optgroup v-for="(unis, province) in universities" :key="province" :label="province">
                  <option v-for="uni in unis" :key="uni" :value="uni">{{ uni }}</option>
                </optgroup>
              </template>
              
              <!-- Placeholder for Providers -->
              <template v-else>
                <option value="Provider Co. 1">Provider Co. 1</option>
                <option value="Provider Co. 2">Provider Co. 2</option>
              </template>
            </select>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>{{ role === 'student' ? 'Institution Email (Student Verification)' : 'Work Email' }}</label>
          <div class="input-wrap">
            
            <input 
              v-model="email" 
              type="email" 
              :placeholder="role === 'student' ? 'myles.naidoo@myuct.ac.za' : 'john.doe@provider.co.za'" 
              class="form-input"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password</label>
          <div class="input-wrap">
            <input 
              v-model="password" 
              type="password" 
              placeholder="*********:)" 
              class="form-input"
            />
          </div>
        </div>

        <div class="form-options">
          <a href="#" @click.prevent="alert('Password reset link sent!')" class="forgot-link">Forgot Password?
          </a>
        </div><br>
              
        <!-- Submit Button -->
        <button class="btn btn-primary" @click="handleLogin">
          Verify & Enter CampusSwap
        </button>
        
        <p class="new-user">
          New here? <a href="#" @click.prevent="alert('Registration coming soon!')"class="create-account-link">Create an account</a>
        </p>

        <!-- Mobile Footer (Hidden on Desktop) -->
        <div class="mobile-footer">
          <p>&#128274; Ozow Escrow Protected &bull; Secured by EduID</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      role: 'student', // 'student' or 'provider'
      email: '',
      password: '',
      selectedInstitution: '',
      
      // List of major SA universities and colleges grouped by provinces.
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
          ' University of South Afica (UNISA) main branch'
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
        'North West': [
          'North-West University (NWU)'
        ],
        'Limpopo': [
          'University of Limpopo (UL)',
          'University of Venda (UNIVEN)'
        ],
        'Mpumalanga': [
          'University of Mpumalanga (UMP)'
        ],
        'Northern Cape': [
          'Sol Plaatje University (SPU)'
        ]
      }
    };
  },
  methods: {
    handleLogin() {
      // Basic validation
      if (!this.email || !this.password || !this.selectedInstitution) {
        alert('Please fill in all fields.');
        return;
      }

      // Hardcoded test credentials for demo (No Backend yet)
      const studentEmail = 'student@myuct.ac.za';
      const studentPass = 'stu123@ent';
      const providerEmail = 'provider@work.co.za';
      const providerPass = 'pro3der';

      // Check Student credentials
      if (this.role === 'student') {
        if (this.email === studentEmail && this.password === studentPass) {
          alert('Student logged in successfully! Redirecting to Student Dashboard...');
          this.$router.push('/student-dashboard');
        } else {
          alert('Invalid Student credentials. Try: student@myuct.ac.za / student123');
        }
      }
      // Check Provider credentials
      else {
        if (this.email === providerEmail && this.password === providerPass) {
          alert('Service Provider logged in successfully! Redirecting to Provider Dashboard...');
          this.$router.push('/provider-dashboard');
        } else {
          alert('Invalid Provider credentials. Try: provider@work.co.za / provider123');
        }
      }
    }
  }
};
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
  background: linear-gradient(to bottom, rgba(13, 27, 61, 0.7), rgba(13, 27, 61, 0.9));
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

.logo-icon {
  font-size: 32px;
  color: #f5b941;
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
}

.role-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 0;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
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

.btn-primary:hover {
  background-color: #e0a330;
  transform: translateY(-2px);
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

/* Mobile Footer - Hidden on Desktop */
.mobile-footer {
  display: none;
}

/* ---------------- MOBILE & RESPONSIVE STYLES ---------------- */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-left {
    display: none; /* Hide left side on mobile */
  }

  .login-right {
    background-color: #ffffff;
    padding: 20px;
    min-height: 100vh;
    align-items: flex-start; /* Start from top */
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

  /* Role Toggle Placement */
  .role-toggle {
    margin-bottom: 20px;
  }

  /* Adjust form margins for mobile */
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

  /* Show Mobile Footer */
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
}

/* Small Mobile tweaks */
@media (max-width: 380px) {
  .form-input {
    padding: 10px 12px 10px 35px;
    font-size: 14px;
  }

  .input-icon {
    left: 10px;
    font-size: 15px;
  }
}
</style>