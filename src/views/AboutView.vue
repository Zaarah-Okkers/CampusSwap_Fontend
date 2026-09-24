<template>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">About us</p>
      <h1>Built at LCA YouthCode. Made for South Africa.</h1>
      <p class="lede">
        CampusSwap SA started as a group project by four students at the
        <strong>LCA YouthCode programme</strong> — a coding academy that trains
        young South Africans to build real software for real problems. We chose
        to build a marketplace because the problems we kept running into weren't
        abstract: they were the ones we and our friends faced every semester.
        Textbooks that cost more than rent. Residence repairs that took weeks to
        fix because nobody was tracking them. Service providers with no way to
        find work except word of mouth.
      </p>
      <p class="lede">
        So we built a platform that solves all three at once. It's a marketplace
        for students. It's a job board for service providers. And it's a
        management tool for residence managers who need to keep track of what's
        broken and who's fixing it.
      </p>
    </section>

    <section class="block">
      <h2>What we set out to solve</h2>
      <div class="grid">
        <article v-for="p in problems" :key="p.title" class="card glass-panel">
          <span class="problem-tag" :class="p.tone">{{ p.tag }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </article>
      </div>
    </section>

    <section class="block">
      <h2>How CampusSwap answers those problems</h2>
      <ol class="timeline">
        <li v-for="m in milestones" :key="m.step">
          <span class="year">{{ m.step }}</span>
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
      <h2>The team</h2>
      <p class="team-intro">
        Four students from the LCA YouthCode programme — designers, developers
        and database engineers who shipped this together.
      </p>
      <div class="grid team">
        <article v-for="p in team" :key="p.name" class="card glass-panel">
          <div class="avatar">{{ initials(p.name) }}</div>
          <h3>{{ p.name }}</h3>
          <p class="role">{{ p.role }}</p>
          <p class="note">{{ p.note }}</p>
          <div class="member-links">
            <a :href="p.github" target="_blank" rel="noopener noreferrer">
              <AppIcon name="github" /> GitHub
            </a>
            <a :href="p.linkedin" target="_blank" rel="noopener noreferrer">
              <AppIcon name="linkedin" /> LinkedIn
            </a>
          </div>
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
import AppIcon from "../components/AppIcon.vue";

const problems = [
  {
    tag: "Student problem",
    tone: "gold",
    title: "Textbooks are unaffordable",
    body: "A single prescribed textbook can cost more than a month of groceries. Second-hand markets exist but they are scattered across WhatsApp groups and Facebook posts with no trust or structure.",
  },
  {
    tag: "Employment problem",
    tone: "mint",
    title: "Service providers have no pipeline",
    body: "Plumbers, electricians, cleaners and handymen in township and campus-adjacent communities rely entirely on word of mouth. They have the skills but no way to reach the people who need them.",
  },
  {
    tag: "Operations problem",
    tone: "purple",
    title: "Residence maintenance is invisible",
    body: "Students log broken taps and faulty plug points, but the Residence Manager has no single place to see what is open, who has quoted, and what has been paid. Repairs sit for weeks.",
  },
  {
    tag: "Trust problem",
    tone: "teal",
    title: "Nobody verifies anyone",
    body: "Campus transactions and informal service jobs both happen on trust that isn\u2019t earned. No ratings, no verification, no recourse when something goes wrong.",
  },
];

const milestones = [
  {
    step: "01",
    title: "For students",
    body: "A verified marketplace where students buy, sell, swap and rent textbooks, tech and dorm essentials from other students. Escrow-protected payments, campus pickup zones and a review system that actually means something.",
  },
  {
    step: "02",
    title: "For service providers",
    body: "SafeHome gives plumbers, electricians, cleaners, gardeners, security and handymen a place to find work, build a public profile with verified credentials, and earn experience and income. Providers quote on jobs and get paid through the platform, not in cash.",
  },
  {
    step: "03",
    title: "For residence managers",
    body: "A single dashboard where managers see every repair request, every quote, every approved job and every completed payment. No more chasing WhatsApp threads to find out if the plumber was ever called.",
  },
  {
    step: "04",
    title: "For the wider community",
    body: "By connecting under-employed service providers to paying work, we create income where there was none. By making student items reusable, we reduce waste. Two small wins against unemployment and cost-of-living pressure, one platform at a time.",
  },
];

const values = [
  {
    title: "Verified by default",
    body: "Every student account is tied to a campus email. Every service provider has a profile with credentials and ratings. Every job is tracked end-to-end. Trust is a feature, not a hope.",
  },
  {
    title: "Money held, not gambled",
    body: "Payments sit in escrow until the buyer confirms the handover, or the Residence Manager approves the completed repair. If an item never arrives or a job is not done, the funds are released back.",
  },
  {
    title: "Two birds, one platform",
    body: "The same system that lets a student buy a second-hand laptop lets a self-employed electrician find paid work. Every transaction on CampusSwap is also a small act of economic participation.",
  },
  {
    title: "Cheap on purpose",
    body: "A flat platform fee, not a percentage. Listing a R2 000 textbook costs the same as listing a R100 one. Providers keep what they earn \u2014 we take a small slice, not a commission.",
  },
];

const team = [
  {
    name: "Lerato Yapi",
    role: "Project Lead & Backend",
    note: "Architecture, the Express API and the MySQL schema design.",
    github: "https://github.com/leratoyapi",
    linkedin: "https://www.linkedin.com/in/lerato-yapi-173276414/",
  },
  {
    name: "Anela Nqenqa",
    role: "Frontend & UX",
    note: "The Vue interface, component library and responsive design system.",
    github: "https://github.com/nqenqaanela-beep",
    linkedin: "https://www.linkedin.com/in/anela-nqenqa-393800413/",
  },
  {
    name: "Siwaphiwe Boto",
    role: "Database & Backend",
    note: "Schema, seed data and the SafeHome service-request workflow.",
    github: "https://github.com/Swail3r",
    linkedin: "https://www.linkedin.com/in/siwaphiwe-siboto-a0839b272/",
  },
  {
    name: "Zaarah Okkers",
    role: "Full-Stack & Integration",
    note: "Wired frontend to backend, authentication and end-to-end API testing.",
    github: "https://github.com/Zaarah-Okkers",
    linkedin: "https://www.linkedin.com/in/zaarah-okkers-3688b1377/",
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 140px;
  color: #f4f2ff;
}

/* ---------- Hero ---------- */
.eyebrow {
  color: #e8b54d;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 12px;
}

.hero h1 {
  font-size: clamp(28px, 4.5vw, 40px);
  line-height: 1.15;
  margin: 0 0 20px;
  color: #f4f2ff;
}

.lede {
  font-size: 16px;
  line-height: 1.75;
  color: rgba(244, 242, 255, 0.78);
  max-width: 66ch;
  margin: 0 0 16px;
}
.lede strong {
  color: #e8b54d;
  font-weight: 700;
}

/* ---------- Blocks ---------- */
.block {
  margin-top: 60px;
}
.block h2 {
  font-size: 22px;
  margin: 0 0 24px;
  color: #f4f2ff;
}

/* Problem cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  border-radius: 14px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.problem-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
}
.problem-tag.gold {
  background: rgba(232, 181, 77, 0.16);
  color: #e8b54d;
}
.problem-tag.mint {
  background: rgba(46, 125, 90, 0.22);
  color: #7ce0b3;
}
.problem-tag.purple {
  background: rgba(108, 75, 106, 0.3);
  color: #d3a9d1;
}
.problem-tag.teal {
  background: rgba(0, 166, 166, 0.16);
  color: #6fd7d7;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #f4f2ff;
}

.card p {
  margin: 0;
  line-height: 1.65;
  color: rgba(244, 242, 255, 0.72);
  font-size: 14px;
}

/* Timeline */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid rgba(255, 255, 255, 0.12);
}
.timeline li {
  display: flex;
  gap: 20px;
  padding: 0 0 28px 24px;
  position: relative;
}
.timeline li::before {
  content: "";
  position: absolute;
  left: -7px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e8b54d;
}
.year {
  color: #e8b54d;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 40px;
}
.timeline h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #f4f2ff;
}
.timeline p {
  margin: 0;
  line-height: 1.65;
  color: rgba(244, 242, 255, 0.72);
}

/* Team */
.team-intro {
  color: rgba(244, 242, 255, 0.72);
  font-size: 14.5px;
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 62ch;
}
.team .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8b54d, #f7d278);
  color: #0a0e27;
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}
.role {
  color: #e8b54d !important;
  font-size: 12px !important;
  font-weight: 600;
  margin-bottom: 8px !important;
}
.note {
  margin-bottom: 14px !important;
}

.member-links {
  display: flex;
  gap: 14px;
  margin-top: 4px;
  flex-wrap: wrap;
  justify-content: center;
}
.member-links a {
  color: #e8b54d;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s ease;
}
.member-links a:hover {
  opacity: 0.75;
}
.member-links a :deep(.app-icon) {
  width: 14px;
  height: 14px;
  color: currentColor;
}

/* CTA */
.cta {
  margin-top: 60px;
  text-align: center;
  border-radius: 14px;
  padding: 40px 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.cta h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #f4f2ff;
}
.cta p {
  margin: 0 0 24px;
  color: rgba(244, 242, 255, 0.72);
}
.btn {
  display: inline-block;
  background: #e8b54d;
  color: #0a0e27;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 9px;
  text-decoration: none;
}
.btn:hover {
  filter: brightness(1.08);
}
</style>
