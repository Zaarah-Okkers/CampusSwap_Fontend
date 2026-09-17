import { createStore } from 'vuex'
import user from './UserStore'
import provider from './ProviderStore'

export default createStore({
  modules: {
    user,
    provider
  }
})
