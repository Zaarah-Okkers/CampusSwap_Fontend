<template>
  <div class="admin-advertise">
    <div class="page-header">
      <h2>📢 Push Advertisements</h2>
      <span class="subtitle">Push ads to premium users</span>
    </div>

    <div class="ad-form glass-panel">
      <h3>Create New Ad</h3>
      <form @submit.prevent="pushAd">
        <div class="form-group">
          <label>Ad Title</label>
          <input v-model="newAd.title" type="text" placeholder="Enter ad title..." required />
        </div>
        <div class="form-group">
          <label>Ad Description</label>
          <textarea v-model="newAd.description" rows="3" placeholder="Enter ad description..." required></textarea>
        </div>
        <div class="form-group">
          <label>Target Audience</label>
          <select v-model="newAd.target">
            <option value="all">All Users</option>
            <option value="premium">Premium Only</option>
            <option value="students">Students Only</option>
          </select>
        </div>
        <div class="form-group">
          <label>Link URL (optional)</label>
          <input v-model="newAd.link" type="url" placeholder="https://example.com" />
        </div>
        <button type="submit" class="push-btn">🚀 Push Ad</button>
      </form>
    </div>

    <div class="ads-list">
      <h3>📋 Recent Ads</h3>
      <div v-for="ad in ads" :key="ad.id" class="ad-item glass-panel">
        <div class="ad-header">
          <span class="ad-title">{{ ad.title }}</span>
          <span class="ad-date">{{ ad.date }}</span>
        </div>
        <p class="ad-description">{{ ad.description }}</p>
        <div class="ad-footer">
          <span class="ad-target">🎯 {{ ad.target }}</span>
          <button class="delete-btn" @click="deleteAd(ad.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newAd = ref({
  title: '',
  description: '',
  target: 'all',
  link: ''
})

const ads = ref([
  { 
    id: 1, 
    title: 'Summer Sale!', 
    description: 'Get 20% off on all textbooks this month!', 
    target: 'all',
    date: '2024-01-15' 
  },
  { 
    id: 2, 
    title: 'Premium Feature', 
    description: 'New premium users get early access to new features!', 
    target: 'premium',
    date: '2024-01-14' 
  }
])

function pushAd() {
  if (!newAd.value.title || !newAd.value.description) {
    alert('Please fill in all required fields')
    return
  }
  
  ads.value.unshift({
    id: Date.now(),
    title: newAd.value.title,
    description: newAd.value.description,
    target: newAd.value.target,
    date: new Date().toISOString().split('T')[0],
    link: newAd.value.link
  })
  
  alert('✅ Ad pushed successfully!')
  newAd.value = { title: '', description: '', target: 'all', link: '' }
}

function deleteAd(id) {
  if (confirm('Delete this ad?')) {
    ads.value = ads.value.filter(a => a.id !== id)
  }
}
</script>

<style scoped>
.admin-advertise {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 24px;
}

h2 {
  color: var(--text);
  margin: 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
}

.ad-form {
  padding: 24px;
  border-radius: 12px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  margin-bottom: 24px;
}

.ad-form h3 {
  color: var(--text);
  margin: 0 0 16px;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--gold);
}

.push-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.push-btn:hover {
  transform: scale(1.02);
}

.ads-list h3 {
  color: var(--text);
  margin: 0 0 16px;
}

.ad-item {
  padding: 16px 20px;
  border-radius: 12px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  margin-bottom: 12px;
}

.ad-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ad-title {
  font-weight: 600;
  color: var(--text);
  font-size: 16px;
}

.ad-date {
  font-size: 12px;
  color: var(--text-faint);
}

.ad-description {
  color: var(--text-muted);
  margin: 0 0 12px;
}

.ad-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad-target {
  font-size: 12px;
  color: var(--text-muted);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--coral);
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}
</style>
