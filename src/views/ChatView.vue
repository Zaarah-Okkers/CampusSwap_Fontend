<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import AppIcon from '../components/AppIcon.vue'
import { swalTheme } from '../utils/swalTheme'
import { RESMANAGER_USER_ID } from '../utils/notifyUsers'

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

  store.dispatch('notifications/create', {
    userId: reporter?.id,
    type: 'safety_report',
    title: 'Safety report submitted',
    message: 'Your report has been received and is being reviewed by the CampusSwap team.',
    metadata: { category: reportForm.value.type, against: activeConversation.value.name }
  })
  store.dispatch('notifications/create', {
    userId: RESMANAGER_USER_ID,
    type: 'safety_report',
    title: 'New safety report',
    message: 'A resident has submitted a new safety report that requires review.',
    actionUrl: '/chat',
    metadata: { category: reportForm.value.type, reporter: reporter?.name, against: activeConversation.value.name }
  })

  showReport.value = false
  reportForm.value = { type: '', description: '' }
  await swalTheme.fire({
    title: 'Report submitted',
    text: 'Your report has been submitted. Our team will review it.',
    icon: 'success'
  })
}
</script>