<template>
  <main class="page">
    <header class="head">
      <p class="eyebrow">Contact</p>
      <h1>Talk to a human</h1>
      <p class="lede">
        We read everything that comes through here. Order problems usually get
        a reply the same day; everything else within two working days.
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
          <input id="name" v-model="form.name" type="text" autocomplete="name" />
          <p v-if="errors.name" class="err">{{ errors.name }}</p>
        </div>

        <div class="field">
          <label for="email">Email address</label>
          <input id="email" v-model="form.email" type="email" autocomplete="email" />
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
          <textarea id="message" v-model="form.message" rows="6" maxlength="1000" />
          <div class="meta">
            <p v-if="errors.message" class="err">{{ errors.message }}</p>
            <span class="count">{{ charsLeft }} left</span>
          </div>
        </div>

        <button class="btn" :disabled="status === 'sending'" @click="submit">
          {{ status === 'sending' ? 'Sending…' : 'Send message' }}
        </button>
      </section>

      <aside class="side">
        <div class="card glass-panel">
          <h2>Email</h2>
          <p><a href="mailto:hello@campusswap.co.za">hello@campusswap.co.za</a></p>
          <p class="dim">General questions and partnerships</p>
        </div>
        <div class="card glass-panel">
          <h2>Support</h2>
          <p><a href="mailto:support@campusswap.co.za">support@campusswap.co.za</a></p>
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
            If a meet-up or listing feels wrong, stop and report it. Do not
            hand over money outside the app.
          </p>
          <p><a href="mailto:safety@campusswap.co.za">safety@campusswap.co.za</a></p>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const form = reactive({
  name: '',
  email: '',
  topic: 'general',
  message: '',
})

const topics = [
  { value: 'general', label: 'General question' },
  { value: 'order', label: 'Problem with an order' },
  { value: 'safehome', label: 'SafeHome listing' },
  { value: 'report', label: 'Report a user' },
  { value: 'partner', label: 'Campus partnership' },
]

const status = ref('idle') // idle | sending | sent | error
const errors = reactive({})

const charsLeft = computed(() => 1000 - form.message.length)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Tell us what to call you.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'That email address does not look right.'
  if (form.message.trim().length < 20) errors.message = 'A bit more detail helps us help you (20 characters minimum).'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  status.value = 'sending'
  try {
    await new Promise((r) => setTimeout(r, 700))
    status.value = 'sent'
    form.name = ''
    form.email = ''
    form.topic = 'general'
    form.message = ''
  } catch (e) {
    status.value = 'error'
  }
}
</script>

<style scoped>
/* full-width dark background */
.page {
  width: 100%;
  min-height: 100vh;
  background: var(--ink);
  color: var(--text);
  padding: 40px 20px 140px;
  box-sizing: border-box;
}

/* center inner content, cap at readable width */
.head,
.layout {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.eyebrow {
  color: var(--gold);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 12px;
}
.head h1 {
  font-size: clamp(26px, 4vw, 34px);
  margin: 0 0 12px;
}
.lede {
  color: var(--text-faint);
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
  border: 1px solid var(--glass-border);
  padding: 24px;
}

.field {
  margin-bottom: 18px;
}
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}
input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  font-size: 14px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 9px;
  padding: 10px 12px;
  resize: vertical;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--gold);
  background: rgba(255, 255, 255, 0.07);
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
  color: var(--text-faint);
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
  background: var(--gold);
  color: var(--ink-elevated);
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
  border: 1px solid var(--glass-border);
  padding: 16px 18px;
}
.card h2 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold);
  margin: 0 0 8px;
}
.card p {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-faint);
}
.card a {
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid rgba(232, 176, 75, 0.5);
}
.dim {
  color: var(--text-faint);
}
</style>