<script setup>
</script>

<template>
  <footer class="app-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <p class="brand-name">CampusSwap<span class="brand-accent">SA</span></p>
        <p class="brand-desc">
          South Africa's trusted, student-only platform for secure peer trading,
          verified off-campus support services, and educational material exchange.
        </p>
      </div>

      <div class="footer-col">
        <p class="col-heading">Services</p>
        <ul>
          <li>Student Marketplace</li>
          <li>SafeHome Maintenance</li>
          <li>BookSphere e-Books</li>
        </ul>
      </div>

      <div class="footer-col">
        <p class="col-heading">Trust &amp; Protection</p>
        <ul>
          <li>Ozow Escrow Guarantee</li>
          <li>EduID Authentication</li>
          <li>Safety Zones &amp; Meetups</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 CampusSwap SA. All rights reserved.</span>
      <span>Ozow Escrow Protected · Secured by EduID</span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: block;
  color: var(--text-muted);
  padding: 40px 0 30px;
  border-top: 1px solid var(--glass-border);
  margin-top: 24px;
  width: 100%;
}

.footer-main {
  display: flex;
  gap: 60px;
  padding-bottom: 24px;
  flex-wrap: wrap;
}

.footer-brand {
  flex: 1.5;
  min-width: 220px;
}

.brand-name {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 10px;
}

.brand-accent {
  color: var(--gold);
}

.brand-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 320px;
  margin: 0;
}

.footer-col {
  min-width: 160px;
}

.col-heading {
  color: var(--gold);
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 14px;
}

.footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
}

.footer-bottom {
  border-top: 1px solid var(--glass-border);
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--text-faint);
}

/* Responsive */
@media (max-width: 640px) {
  .app-footer {
    padding: 30px 0 20px;
  }
  
  .footer-main {
    gap: 30px;
  }
  
  .footer-brand {
    flex: 1 1 100%;
  }
  
  .footer-col {
    min-width: 140px;
  }
  
  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>