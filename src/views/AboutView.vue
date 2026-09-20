<template>
  <main class="page">
    <section class="hero">
      <h1 class="eyebrow">About us</h1>
      <h2 class="hero-title">One campus. Endless possibilities. All in one place.</h2>
      <p class="lede">
        CampusSwap SA is a secure South African student platform that connects
        verified students for peer-to-peer exchange of textbooks, technology and
        study materials, with SafeHome support services for student residences.
        Our purpose is to make campus life more affordable, convenient and safe.
      </p>
    </section>

    <section class="block">
      <h2>How we got here</h2>
      <ol class="timeline">
        <li v-for="m in milestones" :key="m.year">
          <span class="year">{{ m.year }}</span>
          <div>
            <h3>{{ m.title }}</h3>
            <p>{{ m.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="block">
      <h2>What we hold ourselves to</h2>
      <div class="grid">
        <article v-for="v in values" :key="v.title" class="card glass-panel">
          <h3>{{ v.title }}</h3>
          <p>{{ v.body }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>The people behind it</h2>
      <div class="grid">
        <article v-for="p in team" :key="p.name" class="card glass-panel">
          <h3>{{ p.name }}</h3>
          <p class="role">{{ p.role }}</p>
          <p>{{ p.note }}</p>
        </article>
      </div>
    </section>

    <section class="cta glass-panel">
      <h2>Got something gathering dust?</h2>
      <p>Somebody on your campus is looking for it right now.</p>
      <RouterLink to="/login" class="btn">Create an account</RouterLink>
    </section>
  </main>
</template>

<script setup>
const milestones = [
  { year: '01', title: 'Create a verified account', body: 'Students and approved role users register with the information needed to use the platform safely.' },
  { year: '02', title: 'Connect and exchange', body: 'Students can find, buy, sell or swap relevant campus goods through the secure marketplace.' },
  { year: '03', title: 'Request trusted support', body: 'SafeHome connects residence repair requests with service providers and keeps progress visible.' },
  { year: '04', title: 'Keep payments responsible', body: 'Marketplace buyers pay for their own purchases, while Residence Managers pay providers for SafeHome repairs.' },
]

const values = [
  {
    title: 'Students only',
    body: 'Every account is tied to a verified campus email address. No resellers, no scalpers, no bots bidding up prescribed texts in week one.',
  },
  {
    title: 'Money held, not gambled',
    body: 'Payments sit in escrow until the buyer confirms the handover. If an item never arrives, the funds go back — not into a dispute form nobody reads.',
  },
  {
    title: 'Safety is a feature',
    body: 'SafeHome listings are checked against real addresses and past tenant reports. Meet-ups are suggested at staffed campus pickup points.',
  },
  {
    title: 'Cheap on purpose',
    body: 'We take a small flat fee, not a percentage. A R2 000 textbook does not cost twenty times more to list than a R100 one.',
  },
]

const team = [
  { name: 'CampusSwap SA', role: 'Student exchange platform', note: 'A secure platform built around the needs of South African students.' },
  { name: 'Students', role: 'Verified community members', note: 'Students exchange useful academic and campus items at accessible prices.' },
  { name: 'SafeHome network', role: 'Residence support', note: 'Service Providers and Residence Managers coordinate repairs and provider payments.' },
]
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 140px;
  color: var(--text);
}

.eyebrow {
  color: var(--gold);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

.hero h1 {
  font-size: clamp(28px, 4.5vw, 40px);
  line-height: 1.15;
  margin: 0 0 16px;
  max-width: 24ch;
}

.hero-title {
  font-size: clamp(28px, 4.5vw, 40px);
  line-height: 1.15;
  margin: 0 0 16px;
  max-width: 24ch;
}

.lede {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-faint);
  max-width: 62ch;
  margin: 0;
}

.block {
  margin-top: 56px;
}
.block h2 {
  font-size: 20px;
  margin: 0 0 24px;
}

.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid var(--glass-border);
}
.timeline li {
  display: flex;
  gap: 20px;
  padding: 0 0 28px 24px;
  position: relative;
}
.timeline li::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
}
.year {
  color: var(--gold);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 56px;
}
.timeline h3 {
  margin: 0 0 6px;
  font-size: 15px;
}
.timeline p {
  margin: 0;
  line-height: 1.65;
  color: var(--text-faint);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.card {
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--glass-border);
}
.card h3 {
  margin: 0 0 8px;
  font-size: 15px;
}
.card p {
  margin: 0;
  line-height: 1.65;
  color: var(--text-faint);
  font-size: 14px;
}
.role {
  color: var(--gold) !important;
  font-size: 12px !important;
  font-weight: 600;
  margin-bottom: 8px !important;
}

.cta {
  margin-top: 56px;
  text-align: center;
  border-radius: 14px;
  padding: 36px 24px;
  border: 1px solid var(--glass-border);
}
.cta h2 {
  margin: 0 0 8px;
  font-size: 19px;
}
.cta p {
  margin: 0 0 24px;
  color: var(--text-faint);
}
.btn {
  display: inline-block;
  background: var(--gold);
  color: var(--ink-elevated);
  font-weight: 700;
  padding: 11px 26px;
  border-radius: 9px;
  text-decoration: none;
}
</style>