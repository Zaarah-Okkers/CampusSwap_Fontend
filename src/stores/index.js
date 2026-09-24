import { createStore } from "vuex";
import user from "./UserStore";
import provider from "./ProviderStore";
import market from "./MarketStore";

// NotificationStore was removed — notifications now live in the database
// and are fetched from /api/notifications by NotificationsView + the bell.
export default createStore({
  modules: {
    user,
    provider,
    market,
  },
});
