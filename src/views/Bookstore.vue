<template>
  <div class="book-store">
    <div class="hero glass-panel">
      <span class="hero-eyebrow">Booksphere</span>
      <h2>📚 Study material, sorted</h2>
      <p class="hero-sub">eBooks, audiobooks and compiled study guides made by students, for students.</p>
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

    <div class="grid-header">
      <p class="subtitle">{{ filteredBooks.length }} title{{ filteredBooks.length === 1 ? '' : 's' }}</p>
    </div>

    <div class="book-grid" v-if="filteredBooks.length">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card glass-panel">
        <div class="cover-wrap">
          <img :src="book.cover" :alt="book.title" loading="lazy" />
          <span class="format-badge" :class="book.formatClass">{{ book.formatLabel }}</span>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty glass-panel">
      <p class="empty-title">No titles here yet</p>
      <p class="empty-sub">Try a different format filter.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const format = ref('all')

const formats = [
  { key: 'all', label: 'All' },
  { key: 'ebook', label: 'eBooks' },
  { key: 'audiobook', label: 'Audiobooks' },
  { key: 'guide', label: 'Study Guides' }
]

const books = ref([
  {
    id: 1,
    title: 'Organic Chemistry: Compiled Lecture Notes',
    author: 'Compiled by Aisha K. — 2nd year Chem',
    description: 'A semester\'s worth of annotated lecture notes covering reaction mechanisms, with diagrams redrawn for clarity.',
    price: 65,
    size: '18 MB · PDF',
    module: 'CHEM201',
    formatKey: 'guide',
    formatLabel: 'Study Guide',
    formatClass: 'guide',
    cover: 'https://placehold.co/300x400/6C5CE7/FFFFFF?text=Chem+Notes'
  },
  {
    id: 2,
    title: 'Calculus I: Worked Practice Problems',
    author: 'Compiled by Sipho D.',
    description: 'Over 120 worked problems with full step-by-step solutions, grouped by topic for exam prep.',
    price: 45,
    size: '9 MB · PDF',
    module: 'MATH110',
    formatKey: 'guide',
    formatLabel: 'Study Guide',
    formatClass: 'guide',
    cover: 'https://placehold.co/300x400/E8B54D/FFFFFF?text=Calculus'
  },
  {
    id: 3,
    title: 'Intro to Python: A Beginner\'s Companion',
    author: 'Karabo N.',
    description: 'Self-published eBook walking new CS students through Python fundamentals with campus-relevant examples.',
    price: 90,
    size: '4 MB · EPUB',
    module: 'CSC102',
    formatKey: 'ebook',
    formatLabel: 'eBook',
    formatClass: 'ebook',
    cover: 'https://placehold.co/300x400/4ADE80/FFFFFF?text=Python'
  },
  {
    id: 4,
    title: 'Macroeconomics: The Audio Primer',
    author: 'Narrated by Liam P.',
    description: 'A 3-hour audio walkthrough of core macro concepts, recorded for revision on the go between lectures.',
    price: 55,
    size: '3h 04m · MP3',
    module: 'ECON201',
    formatKey: 'audiobook',
    formatLabel: 'Audiobook',
    formatClass: 'audiobook',
    cover: 'https://placehold.co/300x400/6FA8FF/FFFFFF?text=Macro+Audio'
  },
  {
    id: 5,
    title: 'Cell Biology: Illustrated Summary',
    author: 'Naledi S.',
    description: 'Original hand-drawn diagrams and concise summaries covering the full first-year cell biology syllabus.',
    price: 70,
    size: '22 MB · PDF',
    module: 'BIOL110',
    formatKey: 'ebook',
    formatLabel: 'eBook',
    formatClass: 'ebook',
    cover: 'https://placehold.co/300x400/FF8577/FFFFFF?text=Cell+Bio'
  },
  {
    id: 6,
    title: 'Statistics Basics: Narrated Revision',
    author: 'Narrated by Thabo M.',
    description: 'A relaxed, narrated run-through of descriptive and inferential statistics ahead of the mid-year test.',
    price: 40,
    size: '1h 48m · MP3',
    module: 'STAT120',
    formatKey: 'audiobook',
    formatLabel: 'Audiobook',
    formatClass: 'audiobook',
    cover: 'https://placehold.co/300x400/9B59B6/FFFFFF?text=Stats+Audio'
  }
])

const filteredBooks = computed(() => {
  if (format.value === 'all') return books.value
  return books.value.filter(b => b.formatKey === format.value)
})

function downloadBook(book) {
  alert(`⬇️ Downloading "${book.title}"...\n\nDownload feature coming soon!`)
}
</script>

<style scoped>
.book-store {
  padding: 16px 0 120px;
}

.hero {
  border-radius: 22px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.35), rgba(232, 181, 77, 0.12));
}

.hero-eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero h2 {
  font-size: 26px;
  line-height: 1.2;
  margin-bottom: 10px;
  color: var(--text);
}

.hero-sub {
  font-size: 15px;
  color: var(--text-muted);
  max-width: 44ch;
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
  border: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.pill.active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
}

.grid-header {
  margin: 18px 2px 10px;
}

.subtitle {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-faint);
  font-weight: 600;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.book-card {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 28px rgba(5, 7, 20, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: var(--glass);
  border: 1px solid var(--glass-border);
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
  background: var(--violet);
}

.format-badge.audiobook {
  background: var(--sky);
  color: var(--ink);
}

.format-badge.guide {
  background: var(--gold);
  color: var(--ink);
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
  color: var(--text);
  margin: 0 0 4px;
  line-height: 1.3;
}

.book-author {
  font-size: 12px;
  color: var(--text-faint);
  margin: 0 0 8px;
}

.book-desc {
  font-size: 12.5px;
  color: var(--text-muted);
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
  color: var(--text-faint);
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
  color: var(--mint);
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  transition: transform 0.15s ease;
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
  color: var(--text);
}

.empty-sub {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
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