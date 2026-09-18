<!--
  Swap Requests — the seller side of the swap flow.
  A student who taps "Alert seller for swap" on a listing creates a request
  (see ProductModal / MarketplaceView). That request lands here, where the
  seller accepts or declines it. State lives in the `market` Vuex module so
  both sides read the same source of truth.
-->
<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters["user/currentUser"] || {});
const userName = computed(() => user.value.full_name || user.value.name || "");

// Requests addressed to me as the seller.
const requests = computed(() =>
  store.getters["market/requestsForSeller"](userName.value),
);

const pending = computed(() =>
  requests.value.filter((r) => r.status === "pending"),
);
const resolved = computed(() =>
  requests.value.filter((r) => r.status !== "pending"),
);

const hasAny = computed(() => requests.value.length > 0);

function accept(request) {
  store.dispatch("market/acceptSwap", request.id);
}

function decline(request) {
  store.dispatch("market/declineSwap", request.id);
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

onMounted(() => {
  if (!user.value.id)
    router.push({ name: "login", query: { redirect: "/swap-requests" } });
});
</script>

<template>
  <main class="swap-page">
    <header class="page-head">
      <h1>Swap Requests</h1>
      <p class="sub">
        Students who want to swap for your listings show up here. Accept to
        agree to the swap, or decline to pass.
      </p>
    </header>

    <!-- Nothing at all -->
    <div v-if="!hasAny" class="empty-box glass-panel">
      <h3>No swap requests yet</h3>
      <p>
        When someone alerts you about a swap on one of your listings, it will
        appear here.
      </p>
      <button class="btn-gold" @click="router.push('/marketplace')">
        Browse Marketplace
      </button>
    </div>

    <template v-else>
      <!-- Pending: seller must act -->
      <section v-if="pending.length" class="group">
        <h2 class="group-title">
          Awaiting your response ({{ pending.length }})
        </h2>
        <div class="request-list">
          <article
            v-for="req in pending"
            :key="req.id"
            class="request-card glass-panel"
          >
            <img
              v-if="req.productImage"
              :src="req.productImage"
              :alt="req.productName"
              class="thumb"
            />
            <div class="info">
              <h3 class="product-name">{{ req.productName }}</h3>
              <p class="meta">
                <strong>{{ req.buyerName }}</strong> wants to swap
                <span v-if="req.swapFor">· offering: {{ req.swapFor }}</span>
              </p>
              <span class="date"
                >Requested {{ formatDate(req.createdAt) }}</span
              >
            </div>
            <div class="actions">
              <button class="btn-accept" @click="accept(req)">Accept</button>
              <button class="btn-decline" @click="decline(req)">Decline</button>
            </div>
          </article>
        </div>
      </section>

      <!-- Already handled -->
      <section v-if="resolved.length" class="group">
        <h2 class="group-title">Resolved ({{ resolved.length }})</h2>
        <div class="request-list">
          <article
            v-for="req in resolved"
            :key="req.id"
            class="request-card glass-panel resolved"
          >
            <img
              v-if="req.productImage"
              :src="req.productImage"
              :alt="req.productName"
              class="thumb"
            />
            <div class="info">
              <h3 class="product-name">{{ req.productName }}</h3>
              <p class="meta">
                <strong>{{ req.buyerName }}</strong> wanted to swap
              </p>
              <span class="date">{{ formatDate(req.createdAt) }}</span>
            </div>
            <span class="status" :class="req.status">{{ req.status }}</span>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.swap-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 42px 24px 120px;
}

.page-head {
  margin-bottom: 28px;
}
.page-head h1 {
  font-size: 30px;
  margin: 0 0 8px;
}
.sub {
  color: var(--text-muted);
  font-size: 15px;
  margin: 0;
  max-width: 60ch;
}

.empty-box {
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
}
.empty-box h3 {
  margin: 0 0 8px;
}
.empty-box p {
  color: var(--text-muted);
  margin: 0 0 20px;
}

.btn-gold {
  background: var(--gold);
  color: var(--ink);
  border: none;
  border-radius: 10px;
  padding: 12px 22px;
  font-weight: 700;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}
.btn-gold:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.group {
  margin-bottom: 32px;
}
.group-title {
  font-size: 17px;
  margin: 0 0 14px;
  color: var(--text);
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-card {
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 14px;
  padding: 14px 16px;
  flex-wrap: wrap;
}

.request-card.resolved {
  opacity: 0.72;
}

.thumb {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 180px;
}
.product-name {
  font-size: 16px;
  margin: 0 0 4px;
}
.meta {
  color: var(--text-muted);
  font-size: 13.5px;
  margin: 0 0 4px;
}
.date {
  color: var(--text-faint);
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-accept,
.btn-decline {
  border-radius: 9px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
.btn-accept {
  background: var(--mint);
  color: #072614;
}
.btn-accept:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-decline {
  background: transparent;
  border-color: var(--coral);
  color: var(--coral);
}
.btn-decline:hover {
  background: rgba(255, 133, 119, 0.14);
}

.status {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 5px 12px;
  border-radius: 999px;
}
.status.accepted {
  background: var(--mint-soft);
  color: var(--mint);
}
.status.declined {
  background: rgba(255, 133, 119, 0.16);
  color: var(--coral);
}

@media (max-width: 640px) {
  .swap-page {
    padding: 24px 14px 110px;
  }
  .request-card {
    gap: 12px;
  }
  .actions {
    width: 100%;
  }
  .btn-accept,
  .btn-decline {
    flex: 1;
  }
}
</style>
