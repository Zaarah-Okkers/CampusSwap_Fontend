<template>
  <div class="tracker-overlay" @click.self="$emit('close')">
    <div class="tracker-modal">
      <header class="tracker-head">
        <div>
          <p class="eyebrow">
            {{ kind === "order" ? "Marketplace order" : "SafeHome request" }}
          </p>
          <h2>{{ reference }}</h2>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Close">
          ×
        </button>
      </header>

      <p class="status-label">
        Status: <strong>{{ currentStepLabel }}</strong>
      </p>

      <ol class="steps">
        <li
          v-for="(step, i) in steps"
          :key="step.key"
          class="step"
          :class="{
            'is-done': i < currentIndex,
            'is-current': i === currentIndex,
          }"
        >
          <span class="dot">
            <span v-if="i < currentIndex">✓</span>
            <span v-else>{{ i + 1 }}</span>
          </span>
          <div class="step-text">
            <strong>{{ step.label }}</strong>
            <span v-if="i === currentIndex" class="step-note">{{
              step.note
            }}</span>
          </div>
        </li>
      </ol>

      <footer class="tracker-foot">
        <router-link
          v-if="kind === 'order'"
          to="/marketplace"
          class="btn-link"
          @click="$emit('close')"
        >
          Back to marketplace
        </router-link>
        <router-link
          v-else
          to="/safehome"
          class="btn-link"
          @click="$emit('close')"
        >
          Back to SafeHome
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderTrackerModal",
  props: {
    kind: { type: String, default: "order" },
    reference: { type: String, default: "" },
    status: { type: String, default: "" },
  },
  emits: ["close"],
  data() {
    return {
      orderSteps: [
        {
          key: "placed",
          label: "Order placed",
          note: "We received your order.",
          statuses: ["pending", "pending_payment"],
        },
        {
          key: "paid",
          label: "Payment confirmed",
          note: "Funds held in escrow.",
          statuses: ["paid"],
        },
        {
          key: "packing",
          label: "Packing",
          note: "Seller is preparing your item.",
          statuses: [],
        },
        {
          key: "shipped",
          label: "Shipped",
          note: "On the way to the pickup zone.",
          statuses: ["shipped"],
        },
        {
          key: "delivered",
          label: "Delivered",
          note: "Handover confirmed.",
          statuses: ["completed"],
        },
      ],
      repairSteps: [
        {
          key: "submitted",
          label: "Request submitted",
          note: "Awaiting provider.",
          statuses: ["pending"],
        },

        {
          key: "quoted",
          label: "Quote received",
          note: "A provider has priced the job.Awaiting manager approval.",
          statuses: ["quoted"],
        },

        {
          key: "assigned",
          label: "Provider assigned",
          note: "A provider has been assigned to your request.",
          statuses: ["assigned"],
        },

        {
          key: "approved",
          label: "Approved by manager",
          note: "The provider can start.",
          statuses: ["approved"],
        },

        {
          key: "inprogress",
          label: "In progress",
          note: "The provider is on the job.",
          statuses: ["in_progress"],
        },
        {
          key: "completed",
          label: "Completed",
          note: "Work marked done.",
          statuses: ["completed", "paid"],
        },
      ],
    };
  },
  computed: {
    steps() {
      return this.kind === "order" ? this.orderSteps : this.repairSteps;
    },
    currentIndex() {
      const s = (this.status || "").toLowerCase();
      for (let i = this.steps.length - 1; i >= 0; i--) {
        if (this.steps[i].statuses.includes(s)) return i;
      }
      return 0;
    },
    currentStepLabel() {
      return this.steps[this.currentIndex]?.label || "Unknown";
    },
  },
};
</script>

<style scoped>
.tracker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 39, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
  animation: fade 0.2s ease;
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.tracker-modal {
  background: #ffffff;
  border-radius: 18px;
  max-width: 460px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 22px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.tracker-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #6c4b6a;
  padding-bottom: 12px;
  margin-bottom: 16px;
}
.eyebrow {
  color: #6c4b6a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 4px;
}
.tracker-head h2 {
  color: #0d1b3d;
  font-size: 1.15rem;
  margin: 0;
  word-break: break-all;
}
.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}
.close-btn:hover {
  color: #0d1b3d;
}

.status-label {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 18px;
}
.status-label strong {
  color: #0d1b3d;
}

.steps {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}
.step {
  display: flex;
  gap: 14px;
  padding: 12px 0 12px 20px;
  border-left: 2px solid #e5e7eb;
  margin-left: 14px;
  position: relative;
}
.step.is-done {
  border-left-color: #2e7d5a;
}
.step.is-current {
  border-left-color: #f5b941;
}

.dot {
  position: absolute;
  left: -13px;
  top: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step.is-done .dot {
  background: #2e7d5a;
  color: #ffffff;
}
.step.is-current .dot {
  background: #f5b941;
  color: #0d1b3d;
}

.step-text strong {
  color: #0d1b3d;
  font-size: 14px;
  display: block;
}
.step-note {
  color: #64748b;
  font-size: 12.5px;
}

.tracker-foot {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #eef1f5;
}
.btn-link {
  color: #2e7d5a;
  font-weight: 700;
  font-size: 13px;
  text-decoration: none;
}
.btn-link:hover {
  text-decoration: underline;
}
</style>
