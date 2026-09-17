<template>
  <main class="chat-page">
    <header class="chat-header">
      <div>
        <p class="eyebrow">Campus conversations</p>
        <h1><AppIcon name="chat" /> Messages</h1>
        <p class="muted">Message sellers, residents, and service providers safely.</p>
      </div>
      <button class="report-button" @click="openReport"><AppIcon name="report" /> Report an issue</button>
    </header>

    <section class="chat-shell glass-panel">
      <aside class="conversation-list" aria-label="Conversations">
        <label class="search-box"><AppIcon name="search" /><input v-model="search" type="search" placeholder="Search conversations" /></label>
        <button v-for="conversation in filteredConversations" :key="conversation.id" class="conversation" :class="{ active: activeConversation.id === conversation.id, blocked: conversation.role === 'admin' }" :disabled="conversation.role === 'admin'" @click="selectConversation(conversation)">
          <span class="conversation-avatar">{{ conversation.name.charAt(0) }}</span>
          <span class="conversation-copy"><strong>{{ conversation.name }}</strong><small>{{ conversation.subject }}</small><em>{{ conversation.lastMessage }}</em></span>
          <time>{{ conversation.time }}</time>
        </button>
        <p v-if="!filteredConversations.length" class="empty-copy">No conversations found.</p>
      </aside>

      <section class="message-panel" aria-live="polite">
        <header class="message-header"><span class="conversation-avatar large">{{ activeConversation.name.charAt(0) }}</span><div><h2>{{ activeConversation.name }}</h2><p>{{ activeConversation.subject }}</p></div><span v-if="!canSendMessages" class="restricted-label">Messaging restricted</span><button class="icon-button" title="Report this conversation" aria-label="Report this conversation" @click="openReport"><AppIcon name="report" /></button></header>
        <div class="messages">
          <div v-for="message in activeConversation.messages" :key="message.id" class="message" :class="message.from === 'me' ? 'sent' : 'received'"><p>{{ message.text }}</p><time>{{ message.time }}</time></div>
          <p v-if="!activeConversation.messages.length" class="empty-chat">Start the conversation with {{ activeConversation.name }}.</p>
        </div>
        <form v-if="canSendMessages" class="composer" @submit.prevent="sendMessage"><input v-model="draft" type="text" :placeholder="`Message ${activeConversation.name}`" aria-label="Message" /><button class="send-button" type="submit" aria-label="Send message"><AppIcon name="send" /></button></form>
        <p v-else class="restricted-message">Admin accounts cannot participate in user messaging.</p>
      </section>
    </section>

    <div v-if="showReport" class="modal-backdrop" @click.self="closeReport">
      <form class="report-modal glass-panel" @submit.prevent="submitReport">
        <div class="modal-heading"><div><p class="eyebrow">Safety report</p><h2>Report a problem</h2></div><button type="button" class="icon-button" aria-label="Close report form" @click="closeReport"><AppIcon name="close" /></button></div>
        <p class="modal-copy">Reports help CampusSwap respond to scams, harassment, inappropriate behavior, and unsafe interactions.</p>
        <label>Issue type<select v-model="reportForm.type"><option value="">Select an issue</option><option>Scam or fraud</option><option>Inappropriate behavior</option><option>Harassment or threats</option><option>Unsafe meetup</option><option>Other</option></select></label>
        <label>What happened?<textarea v-model="reportForm.description" rows="4" placeholder="Describe what happened and include useful details."></textarea></label>
        <p v-if="reportError" class="form-error">{{ reportError }}</p><p v-if="reportSuccess" class="form-success">{{ reportSuccess }}</p>
        <div class="modal-actions"><button type="button" class="secondary-button" @click="closeReport">Cancel</button><button class="report-submit" type="submit">Submit report</button></div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import AppIcon from '../components/AppIcon.vue'

const route = useRoute()
const store = useStore()
const search = ref('')
const draft = ref('')
const showReport = ref(false)
const reportError = ref('')
const reportSuccess = ref('')
const reportForm = ref({ type: '', description: '' })
const conversations = ref([
  { id: 1, name: 'Aisha K.', role: 'student', subject: 'Organic Chemistry Lecture Notes', lastMessage: 'I can meet at the library.', time: '10:42', messages: [{ id: 1, from: 'them', text: 'Hi, are the lecture notes still available?', time: '10:38' }, { id: 2, from: 'me', text: 'Yes, I can meet at the library this afternoon.', time: '10:40' }, { id: 3, from: 'them', text: 'I can meet at the library.', time: '10:42' }] },
  { id: 2, name: 'ServicePro SA', role: 'service_provider', subject: 'Kitchen tap repair', lastMessage: 'Your booking is confirmed.', time: 'Yesterday', messages: [{ id: 4, from: 'them', text: 'Your booking is confirmed for Friday at 13:00.', time: 'Yesterday' }] },
  { id: 3, name: 'Naledi S.', role: 'student', subject: 'Calculus Textbook', lastMessage: 'Thanks, see you then.', time: 'Mon', messages: [{ id: 5, from: 'me', text: 'The textbook is ready for collection.', time: 'Mon' }, { id: 6, from: 'them', text: 'Thanks, see you then.', time: 'Mon' }] }
])

const queryUser = String(route.query.userId || '')
const queryProduct = String(route.query.productName || '')
const queryUserRecord = store.getters['user/users'].find(user => user.name === queryUser)
if (queryUser && !conversations.value.some(conversation => conversation.name === queryUser)) {
  conversations.value.unshift({ id: Date.now(), name: queryUser, role: queryUserRecord?.role || 'student', subject: queryProduct || 'Marketplace conversation', lastMessage: 'Start a conversation', time: 'Now', messages: [] })
}

const activeConversation = ref(conversations.value.find(conversation => conversation.name === queryUser) || conversations.value[0])
const filteredConversations = computed(() => conversations.value.filter(conversation => `${conversation.name} ${conversation.subject}`.toLowerCase().includes(search.value.toLowerCase())))
const currentUser = computed(() => store.getters['user/currentUser'])
const canSendMessages = computed(() => currentUser.value?.role !== 'admin' && activeConversation.value.role !== 'admin')

function sendMessage() {
  if (!canSendMessages.value) return
  const text = draft.value.trim()
  if (!text) return
  activeConversation.value.messages.push({ id: Date.now(), from: 'me', text, time: 'Now' })
  activeConversation.value.lastMessage = text
  activeConversation.value.time = 'Now'
  draft.value = ''
}

function selectConversation(conversation) {
  if (conversation.role === 'admin') return
  activeConversation.value = conversation
}

function openReport() {
  reportError.value = ''
  reportSuccess.value = ''
  showReport.value = true
}

function closeReport() {
  showReport.value = false
  reportForm.value = { type: '', description: '' }
}

async function submitReport() {
  reportError.value = ''
  reportSuccess.value = ''
  if (!reportForm.value.type) {
    reportError.value = 'Select the type of issue you are reporting.'
    return
  }
  if (reportForm.value.description.trim().length < 15) {
    reportError.value = 'Please provide at least 15 characters describing what happened.'
    return
  }
  const reporter = store.getters['user/currentUser']
  await store.dispatch('user/sendReportToAdmin', {
    reporterName: reporter?.name || 'Logged-in user',
    reportedUserName: activeConversation.value.name,
    category: reportForm.value.type,
    description: reportForm.value.description.trim(),
    conversationSubject: activeConversation.value.subject
  })
  reportSuccess.value = 'Report submitted. Our team will review it.'
  reportForm.value = { type: '', description: '' }
}
</script>

<style scoped>
.chat-page{min-height:100vh;padding:42px 24px 120px}.chat-header{align-items:end;display:flex;justify-content:space-between;gap:20px;margin:0 auto 28px;max-width:1100px}.eyebrow{color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.chat-header h1{font-size:clamp(2rem,4vw,3.2rem);margin:6px 0}.muted{color:var(--text-muted)}.report-button,.report-submit{align-items:center;background:var(--gold);border:0;border-radius:9px;color:var(--ink);cursor:pointer;display:inline-flex;font-weight:700;gap:7px;padding:11px 14px;white-space:nowrap}.chat-shell{display:grid;grid-template-columns:330px 1fr;height:620px;margin:0 auto;max-width:1100px;overflow:hidden}.conversation-list{border-right:1px solid var(--glass-border);overflow-y:auto;padding:16px}.search-box{align-items:center;background:var(--glass-strong);border:1px solid var(--glass-border);border-radius:9px;color:var(--text-muted);display:flex;gap:8px;padding:10px 12px}.search-box input{background:transparent;border:0;color:var(--text);min-width:0;outline:0;width:100%}.conversation{align-items:start;background:transparent;border:0;border-bottom:1px solid var(--glass-border);color:var(--text);cursor:pointer;display:flex;gap:10px;padding:14px 4px;text-align:left;width:100%}.conversation.active{background:var(--gold-soft);border-radius:8px}.conversation-avatar{align-items:center;background:var(--gold);border-radius:50%;color:var(--ink);display:flex;flex:0 0 36px;font-weight:800;height:36px;justify-content:center}.conversation-avatar.large{height:44px;width:44px}.conversation-copy{display:flex;flex:1;flex-direction:column;min-width:0}.conversation-copy strong{font-size:13px}.conversation-copy small,.conversation-copy em{color:var(--text-muted);font-size:11px;font-style:normal;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.conversation time{color:var(--text-faint);font-size:10px;white-space:nowrap}.empty-copy,.empty-chat{color:var(--text-muted);font-size:13px;padding:18px 4px}.message-panel{display:flex;flex-direction:column;min-width:0}.message-header{align-items:center;border-bottom:1px solid var(--glass-border);display:flex;gap:12px;padding:18px 20px}.message-header h2{font-size:1.1rem}.message-header p{color:var(--text-muted);font-size:12px}.icon-button{align-items:center;background:transparent;border:0;color:var(--text-muted);cursor:pointer;display:flex;font-size:18px;margin-left:auto;padding:7px}.icon-button:hover{color:var(--coral)}.messages{display:flex;flex:1;flex-direction:column;gap:12px;overflow-y:auto;padding:22px}.message{max-width:70%}.message p{border-radius:12px;margin:0;padding:10px 13px}.message time{color:var(--text-faint);display:block;font-size:10px;margin-top:4px}.received{align-self:flex-start}.received p{background:var(--glass-strong);color:var(--text)}.sent{align-self:flex-end;text-align:right}.sent p{background:var(--gold);color:var(--ink)}.composer{border-top:1px solid var(--glass-border);display:flex;gap:10px;padding:16px}.composer input{background:var(--glass-strong);border:1px solid var(--glass-border);border-radius:9px;color:var(--text);padding:11px 13px;width:100%}.send-button{align-items:center;background:var(--gold);border:0;border-radius:9px;color:var(--ink);cursor:pointer;display:flex;justify-content:center;width:44px}.modal-backdrop{align-items:center;background:rgba(5,7,20,.72);display:flex;inset:0;justify-content:center;padding:20px;position:fixed;z-index:1100}.report-modal{border-radius:16px;max-width:520px;padding:22px;width:100%}.modal-heading{align-items:start;display:flex;justify-content:space-between}.modal-heading h2{margin-top:4px}.modal-copy{color:var(--text-muted);font-size:13px;margin:14px 0}.report-modal label{color:var(--text);display:block;font-size:13px;font-weight:700;margin-top:14px}.report-modal select,.report-modal textarea{background:var(--glass-strong);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);display:block;font:inherit;margin-top:6px;padding:10px;width:100%}.report-modal textarea{resize:vertical}.form-error{color:var(--coral);font-size:13px;margin-top:12px}.form-success{color:var(--mint);font-size:13px;margin-top:12px}.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}.secondary-button{background:transparent;border:1px solid var(--glass-border);border-radius:9px;color:var(--text);cursor:pointer;padding:10px 14px}@media(max-width:700px){.chat-page{padding:24px 14px 110px}.chat-header{align-items:start;flex-direction:column}.report-button{width:100%;justify-content:center}.chat-shell{display:block;height:auto}.conversation-list{border-bottom:1px solid var(--glass-border);border-right:0;max-height:260px}.message-panel{height:480px}.message{max-width:85%}}
.conversation.blocked { cursor: not-allowed; opacity: .45; }
.restricted-label { color: var(--coral); font-size: 10px; font-weight: 700; margin-left: auto; }
.restricted-message { border-top: 1px solid var(--glass-border); color: var(--text-faint); font-size: 12px; padding: 16px; text-align: center; }
</style>
