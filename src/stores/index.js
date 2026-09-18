import { createStore } from 'vuex'
import user from './UserStore'
import provider from './ProviderStore'
import notifications from './NotificationStore'
import market from './MarketStore'

export default createStore({
  modules: {
    user,
    provider,
    notifications,
    market
  }
})