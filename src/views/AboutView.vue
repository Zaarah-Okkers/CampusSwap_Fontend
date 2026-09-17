<template>
  <main class="page">
    <section class="hero">
      <h1 class="eyebrow">About us</h1>
      <h2 class="hero-title">We started because a textbook cost more than a month of groceries.</h2>
      <p class="lede">
        CampusSwap is a student-to-student marketplace for the things students
        actually need — prescribed books, lab kit, res furniture, a room that
        isn't a scam. Built by students who got tired of paying full price for
        things sitting unused two doors down.
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
  {
    year: '2023',
    title: 'One overpriced textbook',
    body: 'Second-year student Naledi Mokoena paid R1 480 for a stats textbook she used for eleven weeks. A classmate two rows over was trying to give away the same edition. Neither of them knew.',
  },
  {
    year: '2024',
    title: 'A spreadsheet that got out of hand',
    body: 'Naledi and housemates Yusuf Adams and Thabo Nkosi started a shared sheet for swapping books between three res blocks. By September it had 900 rows, four moderators and a waiting list.',
  },
  {
    year: '2025',
    title: 'CampusSwap goes live',
    body: 'The spreadsheet became a proper platform, with verified student accounts, in-app chat and held payments so nobody has to meet a stranger behind the library with cash in hand.',
  },
  {
    year: '2026',
    title: 'Beyond books',
    body: 'SafeHome launched after too many students got burned by ghost landlords. Today CampusSwap covers textbooks, lab kit, res furniture and vetted accommodation across four campuses.',
  },
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
  { name: 'Naledi Mokoena', role: 'Co-founder — Product', note: 'BCom Statistics. Still owns the R1 480 textbook.' },
  { name: 'Yusuf Adams', role: 'Co-founder — Engineering', note: 'Built the first version during an exam study break. Do not ask about his marks that semester.' },
  { name: 'Thabo Nkosi', role: 'Co-founder — Trust & Safety', note: 'Ran the original res WhatsApp group. Has seen every scam there is.' },
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