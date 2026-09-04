<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Sample chat data - in production this would come from an API
const chats = ref([
  {
    id: 1,
    userId: 1,
    userName: 'Thabo M.',
    userAvatar: 'https://placehold.co/100x100/6C5CE7/FFFFFF?text=T',
    lastMessage: 'Hey, is the HP laptop still available?',
    timestamp: '2 min ago',
    unread: true,
    online: true,
    messages: [
      { id: 1, sender: 'other', text: 'Hey, is the HP laptop still available?', timestamp: '2:15 PM' },
      { id: 2, sender: 'me', text: 'Yes, it\'s still available! Would you like to see more photos?', timestamp: '2:17 PM' },
      { id: 3, sender: 'other', text: 'Yes please, that would be great.', timestamp: '2:18 PM' }
    ]
  },
  {
    id: 2,
    userId: 2,
    userName: 'Aisha K.',
    userAvatar: 'https://placehold.co/100x100/E8B54D/FFFFFF?text=A',
    lastMessage: 'I\'m interested in swapping for your Physics book',
    timestamp: '1 hour ago',
    unread: false,
    online: false,
    messages: [
      { id: 1, sender: 'other', text: 'I\'m interested in swapping for your Physics book', timestamp: '1:00 PM' },
      { id: 2, sender: 'me', text: 'Great! What do you have to swap?', timestamp: '1:05 PM' },
      { id: 3, sender: 'other', text: 'I have Organic Chemistry textbook', timestamp: '1:06 PM' }
    ]
  },
  {
    id: 3,
    userId: 3,
    userName: 'Liam P.',
    userAvatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=L',
    lastMessage: 'How long can I rent the bag for?',
    timestamp: '2 days ago',
    unread: false,
    online: true,
    messages: [
      { id: 1, sender: 'other', text: 'How long can I rent the bag for?', timestamp: 'Yesterday' },
      { id: 2, sender: 'me', text: 'Minimum 1 week, maximum 3 months', timestamp: 'Yesterday' }
    ]
  }
])

const selectedChatId = ref(null)
const newMessage = ref('')
const chatContainer = ref(null)

// Get the chat ID from URL params if present
const chatIdFromRoute = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null
})

// Select chat from route or first chat
const selectedChat = computed(() => {
  if (selectedChatId.value) {
    return chats.value.find(c => c.id === selectedChatId.value)
  }
  if (chatIdFromRoute.value) {
    selectedChatId.value = chatIdFromRoute.value
    return chats.value.find(c => c.id === chatIdFromRoute.value)
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
  
  // Scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Handle enter key
function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Start a new chat from swap
function startChatFromSwap(userId, userName, productName) {
  // Check if chat already exists
  const existingChat = chats.value.find(c => c.userId === userId)
  if (existingChat) {
    selectChat(existingChat.id)
    return
  }
  
  // Create new chat
  const newChat = {
    id: Date.now(),
    userId: userId,
    userName: userName,
    userAvatar: `https://placehold.co/100x100/6C5CE7/FFFFFF?text=${userName.charAt(0)}`,
    lastMessage: `I'm interested in swapping for your ${productName}`,
    timestamp: 'Just now',
    unread: true,
    online: true,
    messages: [
      { 
        id: 1, 
        sender: 'me', 
        text: `I'm interested in swapping for your ${productName}`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]
  }
  
  chats.value.unshift(newChat)
  selectChat(newChat.id)
}

// Expose function for other components to use
defineExpose({
  startChatFromSwap
})

// Scroll to bottom on mount
onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
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
                <span class="chat-name">{{ chat.userName }}</span>
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
              <h3>{{ selectedChat.userName }}</h3>
              <span class="online-status" :class="{ online: selectedChat.online }">
                {{ selectedChat.online ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
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
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

.chat-time {
  font-size: 11px;
  color: var(--text-faint);
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
}

@media (min-width: 769px) and (max-width: 1024px) {
  .chat-list {
    width: 280px;
    min-width: 280px;
  }
}
</style>