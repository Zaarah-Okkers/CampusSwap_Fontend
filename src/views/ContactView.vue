<template>
  <main class="page">
    <header class="head">
      <h1>Contact</h1>
      <h2 class="head-title">Talk to a human</h2>
      <p class="lede">
        We read everything that comes through here. Order problems usually get a
        reply the same day; everything else within two working days.
      </p>
    </header>

    <div class="layout">
      <section class="form-wrap glass-panel">
        <div v-if="status === 'sent'" class="banner ok">
          Thanks — your message is in. Check your inbox for a reference number.
        </div>
        <div v-if="status === 'error'" class="banner bad">
          Something went wrong sending that. Try again, or email us directly.
        </div>

        <div class="field">
          <label for="name">Your name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
          />
          <p v-if="errors.name" class="err">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
          />
          <p v-if="errors.email" class="err">{{ errors.email }}</p>
        </div>

        <div class="field">
          <label for="topic">What is this about?</label>
          <select id="topic" v-model="form.topic">
            <option v-for="t in topics" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="6"
            maxlength="1000"
          />
          <div class="meta">
            <p v-if="errors.message" class="err">{{ errors.message }}</p>
            <span class="count">{{ charsLeft }} left</span>
          </div>
        </div>

        <button class="btn" :disabled="status === 'sending'" @click="submit">
          {{ status === "sending" ? "Sending…" : "Send message" }}
        </button>
      </section>

      <aside class="side">
        <div class="card glass-panel">
          <h2>Email</h2>
          <p>
            <a href="mailto:hello@campusswap.co.za">hello@campusswap.co.za</a>
          </p>
          <p class="dim">General questions and partnerships</p>
        </div>
        <div class="card glass-panel">
          <h2>Support</h2>
          <p>
            <a href="mailto:support@campusswap.co.za"
              >support@campusswap.co.za</a
            >
          </p>
          <p class="dim">Orders, payments and account access</p>
        </div>
        <div class="card glass-panel">
          <h2>Campus desk</h2>
          <p>Student Union Building, Room 14</p>
          <p class="dim">Mon–Fri, 10:00–15:00 during term</p>
        </div>
        <div class="card glass-panel urgent">
          <h2>Something unsafe?</h2>
          <p class="dim">
            If a meet-up or listing feels wrong, stop and report it. Do not hand
            over money outside the app.
          </p>
          <p>
            <a href="mailto:safety@campusswap.co.za">safety@campusswap.co.za</a>
          </p>
        </div>
      </aside>
    </div>

    <!-- Sponsors & investors -->
    <section class="sponsors">
      <p class="eyebrow">Partnerships</p>
      <h2>Sponsors &amp; investors</h2>
      <p class="sponsor-lede">
        We're actively looking for partners who share our goal of making campus
        life more affordable and more trustworthy for South African students. If
        you run a bookstore, a hardware retailer, a residence network, or a
        payments platform — we'd love to talk.
      </p>
      <div class="sponsor-grid">
        <article
          v-for="s in sponsorSlots"
          :key="s.tier"
          class="sponsor-card glass-panel"
        >
          <p class="tier">{{ s.tier }}</p>
          <h3>{{ s.title }}</h3>
          <p>{{ s.body }}</p>
        </article>
      </div>
      <p class="sponsor-cta">
        Interested? Email
        <a href="mailto:partners@campusswap.co.za">partners@campusswap.co.za</a>
        and we'll send you our one-page deck.
      </p>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const form = reactive({
  name: "",
  email: "",
  topic: "general",
  message: "",
});

const topics = [
  { value: "general", label: "General question" },
  { value: "order", label: "Problem with an order" },
  { value: "safehome", label: "SafeHome listing" },
  { value: "report", label: "Report a user" },
  { value: "partner", label: "Sponsorship or investment" },
];

const sponsorSlots = [
  {
    tier: "Bookstore partner",
    title: "Textbook supply",
    body: "Provide discounted stock for the marketplace, or run bundle deals during registration week.",
  },
  {
    tier: "Hardware partner",
    title: "Dorm essentials",
    body: "Sponsor starter-kit bundles for first-year students moving into residences.",
  },
  {
    tier: "Payments partner",
    title: "Escrow processing",
    body: "Wire your instant-EFT or card-processing rails into the checkout flow.",
  },
  {
    tier: "Residence network",
    title: "Housing partnerships",
    body: "Feature verified off-campus listings and joint move-in support for students.",
  },
];

const status = ref("idle"); // idle | sending | sent | error
const errors = reactive({});

const charsLeft = computed(() => 1000 - form.message.length);

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  if (!form.name.trim()) errors.name = "Tell us what to call you.";
  if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "That email address does not look right.";
  if (form.message.trim().length < 20)
    errors.message =
      "A bit more detail helps us help you (20 characters minimum).";
  return Object.keys(errors).length === 0;
}

async function submit() {
  if (!validate()) return;
  status.value = "sending";
  try {
    // No contact endpoint yet — simulate a send for the demo.
    await new Promise((r) => setTimeout(r, 700));
    status.value = "sent";
    form.name = "";
    form.email = "";
    form.topic = "general";
    form.message = "";
  } catch (e) {
    status.value = "error";
  }
}
</script>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 140px;
  color: #f4f2ff;
}
.head h1 {
  color: #e8b54d;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  margin: 0;
}
.head-title {
  color: #f4f2ff;
  font-family: inherit;
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  font-weight: 700;
  letter-spacing: 0;
  margin: 8px 0 12px;
}
.lede {
  color: rgba(244, 242, 255, 0.72);
  line-height: 1.7;
  max-width: 58ch;
  margin: 0 0 40px;
}

.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  align-items: start;
}
@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.form-wrap {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 24px;
}

.field {
  margin-bottom: 18px;
}
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #f4f2ff;
  margin-bottom: 6px;
}
input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 14px;
  color: #f4f2ff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9px;
  padding: 10px 12px;
  resize: vertical;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #e8b54d;
  background: rgba(255, 255, 255, 0.07);
}
option {
  background: #12173f;
  color: #f4f2ff;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}
.count {
  font-size: 12px;
  color: rgba(244, 242, 255, 0.5);
  margin-left: auto;
}
.err {
  color: #ff9d9d;
  font-size: 12px;
  margin: 6px 0 0;
}

.btn {
  font: inherit;
  font-weight: 700;
  background: #e8b54d;
  color: #0a0e27;
  border: 0;
  border-radius: 9px;
  padding: 11px 26px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.banner {
  border-radius: 9px;
  padding: 12px 16px;
  font-size: 14px;
  margin-bottom: 18px;
}
.ok {
  background: rgba(88, 200, 140, 0.12);
  border: 1px solid rgba(88, 200, 140, 0.35);
  color: #a9e6c5;
}
.bad {
  background: rgba(255, 110, 110, 0.12);
  border: 1px solid rgba(255, 110, 110, 0.35);
  color: #ffb3b3;
}

.side {
  display: grid;
  gap: 14px;
}
.card {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 16px 18px;
}
.card h2 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #e8b54d;
  margin: 0 0 8px;
}
.card p {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(244, 242, 255, 0.72);
}
.card a {
  color: #f4f2ff;
  text-decoration: none;
  border-bottom: 1px solid rgba(232, 181, 77, 0.5);
}
.card a:hover {
  border-bottom-color: #e8b54d;
}
.dim {
  color: rgba(244, 242, 255, 0.5);
}

/* Sponsors section */
.sponsors {
  margin-top: 72px;
}
.eyebrow {
  color: #e8b54d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 8px;
}
.sponsors h2 {
  font-size: 22px;
  color: #f4f2ff;
  margin: 0 0 12px;
}
.sponsor-lede {
  color: rgba(244, 242, 255, 0.72);
  line-height: 1.7;
  max-width: 62ch;
  margin: 0 0 28px;
}
.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.sponsor-card {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 20px;
}
.tier {
  color: #e8b54d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 6px;
}
.sponsor-card h3 {
  color: #f4f2ff;
  font-size: 15px;
  margin: 0 0 8px;
}
.sponsor-card p {
  color: rgba(244, 242, 255, 0.72);
  font-size: 13.5px;
  line-height: 1.55;
  margin: 0;
}
.sponsor-cta {
  margin: 28px 0 0;
  color: rgba(244, 242, 255, 0.72);
  font-size: 14px;
}
.sponsor-cta a {
  color: #e8b54d;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(232, 181, 77, 0.5);
}
.sponsor-cta a:hover {
  border-bottom-color: #e8b54d;
}
</style>
