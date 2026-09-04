<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/UserStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Chat data
const chats = ref([])
const selectedChatId = ref(null)
const newMessage = ref('')
const chatContainer = ref(null)
const showReportModal = ref(false)
const reportReason = ref('')
const reportDetails = ref('')
const reportingChat = ref(null)

// Initialize chats from users
function initializeChats() {
  // Create chats with users who have messages
  const existingChats = [
    {
      id: 1,
      userId: 2,
      userName: 'Thabo M.',
      userRole: 'student',
      userAvatar: 'https://placehold.co/100x100/E8B54D/FFFFFF?text=T',
      lastMessage: 'Hey, is the HP laptop still available?',
      timestamp: '2 min ago',
      unread: true,
      online: false,
      messages: [
        { id: 1, sender: 'other', text: 'Hey, is the HP laptop still available?', timestamp: '2:15 PM' },
        { id: 2, sender: 'me', text: 'Yes, it\'s still available! Would you like to see more photos?', timestamp: '2:17 PM' },
        { id: 3, sender: 'other', text: 'Yes please, that would be great.', timestamp: '2:18 PM' }
      ]
    },
    {
      id: 2,
      userId: 3,
      userName: 'Aisha K.',
      userRole: 'student',
      userAvatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=A',
      lastMessage: 'I\'m interested in swapping for your Physics book',
      timestamp: '1 hour ago',
      unread: false,
      online: true,
      messages: [
        { id: 1, sender: 'other', text: 'I\'m interested in swapping for your Physics book', timestamp: '1:00 PM' },
        { id: 2, sender: 'me', text: 'Great! What do you have to swap?', timestamp: '1:05 PM' },
        { id: 3, sender: 'other', text: 'I have Organic Chemistry textbook', timestamp: '1:06 PM' }
      ]
    },
    {
      id: 3,
      userId: 4,
      userName: 'Liam P.',
      userRole: 'student',
      userAvatar: 'https://placehold.co/100x100/FF8577/FFFFFF?text=L',
      lastMessage: 'How long can I rent the bag for?',
      timestamp: '2 days ago',
      unread: false,
      online: false,
      messages: [
        { id: 1, sender: 'other', text: 'How long can I rent the bag for?', timestamp: 'Yesterday' },
        { id: 2, sender: 'me', text: 'Minimum 1 week, maximum 3 months', timestamp: 'Yesterday' }
      ]
    },
    {
      id: 4,
      userId: 6,
      userName: 'ServicePro SA',
      userRole: 'service_provider',
      userAvatar: 'https://placehold.co/100x100/6FA8FF/FFFFFF?text=SP',
      lastMessage: 'Your maintenance request has been received',
      timestamp: '3 days ago',
      unread: false,
      online: false,
      messages: [
        { id: 1, sender: 'other', text: 'Your maintenance request has been received', timestamp: '3 days ago' },
        { id: 2, sender: 'me', text: 'Thank you, when can I expect a technician?', timestamp: '3 days ago' },
        { id: 3, sender: 'other', text: 'We\'ll send someone within 24 hours', timestamp: '2 days ago' }
      ]
    }
  ]
  
  // Check if we have chat data from URL params (for swap)
  if (route.query.userId && route.query.productName) {
    const existingChat = existingChats.find(c => c.userName === route.query.userId)
    if (existingChat) {
      // Use existing chat
      chats.value = existingChats
      selectChat(existingChat.id)
    } else {
      // Create new chat from swap
      const newChat = {
        id: Date.now(),
        userId: Date.now() + 1,
        userName: route.query.userId,
        userRole: 'student',
        userAvatar: `https://placehold.co/100x100/6C5CE7/FFFFFF?text=${route.query.userId.charAt(0)}`,
        lastMessage: `I'm interested in swapping for your ${route.query.productName}`,
        timestamp: 'Just now',
        unread: true,
        online: true,
        messages: [
          { 
            id: 1, 
            sender: 'me', 
            text: `I'm interested in swapping for your ${route.query.productName}`, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]
      }
      chats.value = [newChat, ...existingChats]
      selectChat(newChat.id)
      return
    }
  }
  
  chats.value = existingChats
}

// Get selected chat
const selectedChat = computed(() => {
  if (selectedChatId.value) {
    return chats.value.find(c => c.id === selectedChatId.value)
  }
  if (chats.value.length > 0) {
    selectedChatId.value = chats.value[0].id
    return chats.value[0]
  }
  return null
})

// Select a chat
function selectChat(chatId) {
  selectedChatId.value = chatId
  const chat = chats.value.find(c => c.id === chatId)
  if (chat) {
    chat.unread = false
    // Update URL
    router.push(`/chat/${chatId}`)
  }
  scrollToBottom()
}

// Send a message
function sendMessage() {
  if (!newMessage.value.trim() || !selectedChat.value) return
  
  const message = {
    id: Date.now(),
    sender: 'me',
    text: newMessage.value.trim(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  selectedChat.value.messages.push(message)
  selectedChat.value.lastMessage = message.text
  selectedChat.value.timestamp = 'Just now'
  
  newMessage.value = ''
  
  // Auto-reply from service provider or other user
  if (selectedChat.value.userRole === 'service_provider' && message.text.includes('hello')) {
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'other',
        text: 'Hello! How can I help you with our services today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      selectedChat.value.messages.push(reply)
      selectedChat.value.lastMessage = reply.text
      scrollToBottom()
    }, 1500)
  }
  
  scrollToBottom()
}

// Handle enter key
function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Scroll to bottom of messages
function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Open report modal
function openReportModal() {
  if (!selectedChat.value) return
  reportingChat.value = selectedChat.value
  showReportModal.value = true
}

// Close report modal
function closeReportModal() {
  showReportModal.value = false
  reportReason.value = ''
  reportDetails.value = ''
  reportingChat.value = null
}

// Submit report
function submitReport() {
  if (!reportReason.value || !reportingChat.value) return
  
  const report = {
    id: Date.now(),
    reporterId: userStore.currentUser.id,
    reporterName: userStore.currentUser.name,
    reportedUserId: reportingChat.value.userId,
    reportedUserName: reportingChat.value.userName,
    reason: reportReason.value,
    details: reportDetails.value || 'No additional details provided',
    chatId: reportingChat.value.id,
    chatMessages: reportingChat.value.messages,
    timestamp: new Date(),
    status: 'pending'
  }
  
  // Send report to admin
  userStore.sendReportToAdmin(report)
  
  // Show success message
  alert('✅ Report submitted successfully! Admin has been notified.')
  
  // Close modal
  closeReportModal()
}

// Get user role badge
function getRoleBadge(role) {
  const badges = {
    'student': '🎓 Student',
    'admin': '👑 Admin',
    'service_provider': '🔧 Service Provider'
  }
  return badges[role] || role
}

// Get user role color
function getRoleColor(role) {
  const colors = {
    'student': 'var(--violet)',
    'admin': 'var(--coral)',
    'service_provider': 'var(--sky)'
  }
  return colors[role] || 'var(--text)'
}

// Watch for chat container changes
watch(selectedChat, () => {
  scrollToBottom()
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    const chat = chats.value.find(c => c.id === parseInt(newId))
    if (chat) {
      selectChat(chat.id)
    }
  }
}, { immediate: true })

// Initialize on mount
onMounted(() => {
  initializeChats()
  
  // Check if we have a chat ID from route
  if (route.params.id) {
    const chat = chats.value.find(c => c.id === parseInt(route.params.id))
    if (chat) {
      selectChat(chat.id)
    }
  }
})
</script>

<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- Chat List -->
      <div class="chat-list">
        <div class="chat-list-header">
          <button class="back-btn" @click="router.push('/')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <h2>Messages</h2>
          <button class="new-chat-btn" aria-label="New message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
        
        <div class="chat-list-items">
          <div
            v-for="chat in chats"
            :key="chat.id"
            class="chat-item"
            :class="{ active: selectedChatId === chat.id }"
            @click="selectChat(chat.id)"
          >
            <div class="chat-avatar">
              <img :src="chat.userAvatar" :alt="chat.userName" />
              <span class="online-dot" v-if="chat.online"></span>
            </div>
            <div class="chat-info">
              <div class="chat-name-row">
                <div>
                  <span class="chat-name">{{ chat.userName }}</span>
                  <span class="role-badge" :style="{ background: getRoleColor(chat.userRole) }">
                    {{ getRoleBadge(chat.userRole) }}
                  </span>
                </div>
                <span class="chat-time">{{ chat.timestamp }}</span>
              </div>
              <div class="chat-last-message">
                <span class="message-text">{{ chat.lastMessage }}</span>
                <span class="unread-badge" v-if="chat.unread">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" v-if="selectedChat">
        <div class="chat-header">
          <div class="chat-user-info">
            <img :src="selectedChat.userAvatar" :alt="selectedChat.userName" class="chat-user-avatar" />
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3>{{ selectedChat.userName }}</h3>
                <span class="role-badge" :style="{ background: getRoleColor(selectedChat.userRole) }">
                  {{ getRoleBadge(selectedChat.userRole) }}
                </span>
              </div>
              <span class="online-status" :class="{ online: selectedChat.online }">
                {{ selectedChat.online ? '🟢 Online' : '⚪ Offline' }}
              </span>
            </div>
          </div>
          <button class="report-btn" @click="openReportModal" aria-label="Report user">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Report</span>
          </button>
        </div>

        <div class="messages-container" ref="chatContainer">
          <div
            v-for="message in selectedChat.messages"
            :key="message.id"
            class="message"
            :class="{ 'message-sent': message.sender === 'me', 'message-received': message.sender === 'other' }"
          >
            <div class="message-bubble">
              <span class="message-text">{{ message.text }}</span>
              <span class="message-time">{{ message.timestamp }}</span>
            </div>
          </div>
        </div>

        <div class="message-input-container">
          <button class="attach-btn" aria-label="Attach file">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18"/>
              <line x1="8" y1="2" x2="8" y2="22"/>
              <line x1="16" y1="2" x2="16" y2="22"/>
              <line x1="2" y1="8" x2="22" y2="8"/>
              <line x1="2" y1="16" x2="22" y2="16"/>
            </svg>
          </button>
          <input
            v-model="newMessage"
            @keydown="handleKeydown"
            type="text"
            placeholder="Type a message..."
            class="message-input"
          />
          <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="empty-chat" v-else>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <h3>No chat selected</h3>
        <p>Choose a conversation from the list</p>
      </div>
    </div>

    <!-- Report Modal -->
    <div v-if="showReportModal" class="modal-overlay" @click.self="closeReportModal">
      <div class="modal-box glass-panel">
        <div class="modal-header">
          <div class="drag-handle"></div>
          <button class="close-btn" @click="closeReportModal" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <h3>Report User</h3>
          <p class="report-info">
            Reporting: <strong>{{ reportingChat?.userName }}</strong>
            <span class="role-badge" :style="{ background: getRoleColor(reportingChat?.userRole) }" v-if="reportingChat">
              {{ getRoleBadge(reportingChat.userRole) }}
            </span>
          </p>
          
          <div class="form-group">
            <label>Reason for reporting</label>
            <select v-model="reportReason" class="input">
              <option value="">Select a reason...</option>
              <option value="harassment">Harassment or Bullying</option>
              <option value="spam">Spam or Scam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="fraud">Fraud or Misrepresentation</option>
              <option value="fake">Fake Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Additional details (optional)</label>
            <textarea 
              v-model="reportDetails" 
              rows="4" 
              class="input" 
              placeholder="Please provide any additional information about this report..."
            ></textarea>
          </div>
          
          <div class="btn-row">
            <button class="cancel-btn" @click="closeReportModal">Cancel</button>
            <button class="submit-btn" @click="submitReport" :disabled="!reportReason">
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  width: 100%;
  height: calc(100vh - 85px);
  padding: 20px 0;
}

.chat-container {
  display: flex;
  height: 100%;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

/* Chat List */
.chat-list {
  width: 340px;
  min-width: 340px;
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
}

.chat-list-header {
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--glass-border);
}

.back-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
}

.back-btn svg {
  width: 24px;
  height: 24px;
}

.chat-list-header h2 {
  flex: 1;
  font-size: 20px;
  color: var(--text);
  margin: 0;
}

.new-chat-btn {
  background: var(--gold);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ink);
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  transform: scale(1.05);
}

.new-chat-btn svg {
  width: 18px;
  height: 18px;
}

.chat-list-items {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.chat-item {
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.chat-item.active {
  background: var(--gold-soft);
  border-left: 3px solid var(--gold);
}

.chat-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: var(--mint);
  border-radius: 50%;
  border: 2px solid var(--ink-elevated);
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 4px;
}

.chat-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.role-badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
}

.chat-time {
  font-size: 11px;
  color: var(--text-faint);
  white-space: nowrap;
}

.chat-last-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.chat-last-message .message-text {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unread-badge {
  background: var(--gold);
  color: var(--ink);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-user-info h3 {
  font-size: 16px;
  color: var(--text);
  margin: 0;
}

.online-status {
  font-size: 12px;
  color: var(--text-faint);
}

.online-status.online {
  color: var(--mint);
}

.report-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 133, 119, 0.1);
  border: 1px solid rgba(255, 133, 119, 0.3);
  color: var(--coral);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.report-btn:hover {
  background: rgba(255, 133, 119, 0.2);
  transform: scale(1.05);
}

.report-btn svg {
  width: 16px;
  height: 16px;
}

.messages-container {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-sent {
  align-self: flex-end;
}

.message-received {
  align-self: flex-start;
}

.message-bubble {
  padding: 10px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
}

.message-sent .message-bubble {
  background: var(--gold);
  color: var(--ink);
  border-color: var(--gold);
}

.message-received .message-bubble {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 10px;
  color: var(--text-faint);
  margin-left: 8px;
  opacity: 0.7;
}

.message-sent .message-time {
  color: rgba(10, 14, 39, 0.5);
}

.message-input-container {
  padding: 16px 24px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  gap: 12px;
  align-items: center;
}

.attach-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.attach-btn:hover {
  color: var(--text);
}

.attach-btn svg {
  width: 20px;
  height: 20px;
}

.message-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: var(--gold);
}

.message-input::placeholder {
  color: var(--text-faint);
}

.send-btn {
  background: var(--gold);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ink);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn svg {
  width: 18px;
  height: 18px;
}

/* Empty State */
.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 12px;
}

.empty-chat svg {
  width: 64px;
  height: 64px;
  color: var(--text-faint);
}

.empty-chat h3 {
  font-size: 20px;
  color: var(--text);
  margin: 0;
}

.empty-chat p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* Report Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: var(--ink-elevated);
  border-radius: 24px;
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slide-up 0.3s ease;
  border: 1px solid var(--glass-border);
}

@keyframes slide-up {
  from { transform: translateY(30px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.modal-header {
  position: sticky;
  top: 0;
  background: var(--ink-elevated);
  padding: 12px 20px 0;
  z-index: 2;
  border-radius: 24px 24px 0 0;
}

.drag-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--glass-border);
  margin: 0 auto 6px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(10, 14, 39, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 14px;
  height: 14px;
}

.modal-body {
  padding: 0 24px 24px;
}

.modal-body h3 {
  margin: 0 0 8px;
  font-size: 22px;
  color: var(--text);
  font-family: 'Fraunces', serif;
}

.report-info {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.report-info strong {
  color: var(--text);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.input {
  padding: 11px 14px;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(232, 181, 77, 0.15);
}

select.input option {
  background: var(--ink-elevated);
  color: var(--text);
}

textarea.input {
  resize: vertical;
  min-height: 80px;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.cancel-btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.submit-btn {
  flex: 2;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: var(--coral);
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(255, 133, 119, 0.3);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-page {
    padding: 12px 0;
    height: calc(100vh - 80px);
  }
  
  .chat-container {
    border-radius: 16px;
    flex-direction: column;
  }
  
  .chat-list {
    width: 100%;
    min-width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--glass-border);
    max-height: 200px;
  }
  
  .chat-list-header {
    padding: 12px 16px;
  }
  
  .back-btn {
    display: flex;
  }
  
  .chat-list-header h2 {
    font-size: 17px;
  }
  
  .chat-item {
    padding: 10px 16px;
  }
  
  .chat-messages {
    flex: 1;
    min-height: 300px;
  }
  
  .chat-header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .messages-container {
    padding: 12px 16px;
  }
  
  .message {
    max-width: 85%;
  }
  
  .message-input-container {
    padding: 12px 16px;
  }
  
  .chat-user-avatar {
    width: 32px;
    height: 32px;
  }
  
  .report-btn span {
    display: none;
  }
  
  .modal-box {
    width: 100%;
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
    bottom: 0;
    position: absolute;
    animation: slide-up-mobile 0.3s ease;
  }
  
  @keyframes slide-up-mobile {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .modal-overlay {
    align-items: flex-end;
  }
  
  .modal-body {
    padding: 0 16px 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .chat-list {
    width: 280px;
    min-width: 280px;
  }
}
</style>