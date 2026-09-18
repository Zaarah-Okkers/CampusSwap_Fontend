import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import Swal from 'sweetalert2'

const app = createApp(App)
app.config.globalProperties.$swal = Swal


app.use(router)
app.use(store)

app.mount('#app')