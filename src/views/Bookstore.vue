<template>
  <div class="book-store" :class="{ embedded }">
    <div class="hero glass-panel">
      <span class="hero-eyebrow">Booksphere</span>
      <h2><AppIcon name="book" /> Study material, sorted</h2>
      <p class="hero-sub">
        eBooks, audiobooks and compiled study guides made by students, for
        students.
      </p>
    </div>

    <div class="pills">
      <button
        v-for="f in formats"
        :key="f.key"
        class="pill"
        :class="{ active: format === f.key }"
        @click="format = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <p v-if="loading" class="state-msg glass-panel">Loading books…</p>
    <p v-else-if="error" class="state-msg glass-panel error">{{ error }}</p>

    <template v-else>
      <div class="grid-header">
        <p class="subtitle">
          {{ filtered.length }} title{{ filtered.length === 1 ? "" : "s" }}
        </p>
      </div>

      <div v-if="filtered.length" class="book-grid">
        <div
          v-for="book in filtered"
          :key="book.id"
          class="book-card glass-panel"
        >
          <div class="cover-wrap">
            <img :src="book.cover" :alt="book.title" loading="lazy" />
            <span class="format-badge" :class="book.formatClass">
              {{ book.formatLabel }}
            </span>
          </div>
          <div class="book-body">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-desc">{{ book.description }}</p>
            <div class="book-meta">
              <span class="meta-item">{{ book.size }}</span>
              <span class="meta-item">{{ book.module }}</span>
            </div>
            <div class="book-footer">
              <span class="book-price">R{{ book.price }}</span>
              <button class="download-btn" @click="downloadBook(book)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty glass-panel">
        <p class="empty-title">No titles here yet</p>
        <p class="empty-sub">
          {{
            format === "all"
              ? "Students haven't published any material yet."
              : "Try a different format filter."
          }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AppIcon from "../components/AppIcon.vue";
import Swal from "sweetalert2";
import { API_BASE } from "../services/api";

defineProps({
  embedded: { type: Boolean, default: false },
});

const format = ref("all");
const books = ref([]);
const loading = ref(true);
const error = ref("");

const formats = [
  { key: "all", label: "All" },
  { key: "ebook", label: "eBooks" },
  { key: "audiobook", label: "Audiobooks" },
  { key: "guide", label: "Study Guides" },
];

async function loadBooks() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(`${API_BASE}/books`);
    if (!res.ok) throw new Error(`Failed (${res.status})`);
    const body = await res.json();
    books.value = body.data || [];
  } catch (err) {
    error.value = "Could not load books. " + err.message;
    books.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadBooks);

const filtered = computed(() => {
  if (format.value === "all") return books.value;
  return books.value.filter((b) => b.formatKey === format.value);
});

function downloadBook(book) {
  Swal.fire({
    icon: "info",
    title: `Download "${book.title}"`,
    text: "Download is coming soon in a future release.",
    confirmButtonColor: "#2e7d5a",
  });
}
</script>

<style scoped>
.book-store {
  background: #0a0e27;
  min-height: 100vh;
  padding: 42px max(24px, calc((100% - 1100px) / 2)) 120px;
  box-sizing: border-box;
}

.book-store.embedded {
  min-height: 0;
  padding: 16px 0 0;
}

.hero {
  border-radius: 22px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background: #171d4c;
}
.hero-eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #e8b54d;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hero h2 {
  font-size: 26px;
  line-height: 1.2;
  margin-bottom: 10px;
  color: #f4f2ff;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hero-sub {
  font-size: 15px;
  color: rgba(244, 242, 255, 0.62);
  max-width: 44ch;
  margin: 0;
}

.pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0 8px;
  scrollbar-width: none;
}
.pills::-webkit-scrollbar {
  display: none;
}
.pill {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(244, 242, 255, 0.62);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}
.pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f4f2ff;
}
.pill.active {
  background: #e8b54d;
  border-color: #e8b54d;
  color: #0a0e27;
}

.state-msg {
  color: #f4f2ff;
  padding: 40px 20px;
  text-align: center;
  border-radius: 16px;
  margin-top: 12px;
}
.state-msg.error {
  color: #ff8577;
}

.grid-header {
  margin: 18px 2px 10px;
}
.subtitle {
  margin: 0;
  font-size: 12.5px;
  color: rgba(244, 242, 255, 0.4);
  font-weight: 600;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 28px rgba(5, 7, 20, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(5, 7, 20, 0.4);
}

.cover-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}
.cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.format-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 10px;
  color: white;
  text-transform: uppercase;
}
.format-badge.ebook {
  background: #6c5ce7;
}
.format-badge.audiobook {
  background: #6fa8ff;
  color: #0a0e27;
}
.format-badge.guide {
  background: #e8b54d;
  color: #0a0e27;
}

.book-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.book-title {
  font-size: 15px;
  font-weight: 600;
  color: #f4f2ff;
  margin: 0 0 4px;
  line-height: 1.3;
}
.book-author {
  font-size: 12px;
  color: rgba(244, 242, 255, 0.4);
  margin: 0 0 8px;
}
.book-desc {
  font-size: 12.5px;
  color: rgba(244, 242, 255, 0.62);
  line-height: 1.5;
  margin: 0 0 10px;
}
.book-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.meta-item {
  font-size: 11px;
  color: rgba(244, 242, 255, 0.4);
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}
.book-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.book-price {
  font-weight: 700;
  font-size: 16px;
  color: #4ade80;
}
.download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  background: #e8b54d;
  color: #0a0e27;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
}
.download-btn svg {
  width: 14px;
  height: 14px;
}
.download-btn:hover {
  transform: translateY(-1px);
}

.empty {
  border-radius: 18px;
  padding: 60px 20px;
  text-align: center;
}
.empty-title {
  font-size: 17px;
  margin-bottom: 6px;
  color: #f4f2ff;
}
.empty-sub {
  font-size: 13px;
  color: rgba(244, 242, 255, 0.62);
}

@media (max-width: 640px) {
  .book-store {
    padding: 24px 14px 110px;
  }
  .book-store.embedded {
    padding: 12px 0 0;
  }
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .hero {
    padding: 20px 16px;
  }
  .hero h2 {
    font-size: 20px;
  }
  .book-body {
    padding: 10px;
  }
}
</style>
