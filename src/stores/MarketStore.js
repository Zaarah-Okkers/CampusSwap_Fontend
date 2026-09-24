// Marketplace cart + swap-request state. Persists to localStorage so a cart
// and a pending swap request survive a page refresh. There is no backend call
// here — this is the front-end half of the flow, so the requester side
// (ProductModal) and the seller side (SwapRequestsView) share one source of
// truth instead of two components disagreeing.
const CART_KEY = "cs-cart";
const SWAP_KEY = "cs-swap-requests";

function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail (private browsing, quota) — in-memory state still
    // works for the rest of the session.
  }
}

export default {
  namespaced: true,
  state: {
    cart: load(CART_KEY),
    swapRequests: load(SWAP_KEY),
  },
  getters: {
    cartCount: (state) =>
      state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    cartTotal: (state) =>
      state.cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
        0,
      ),
    // Requests addressed to a given seller.
    requestsForSeller: (state) => (sellerName) =>
      state.swapRequests.filter((r) => r.sellerName === sellerName),
    // Requests made by a given buyer.
    requestsByBuyer: (state) => (buyerName) =>
      state.swapRequests.filter((r) => r.buyerName === buyerName),
    pendingCount: (state) =>
      state.swapRequests.filter((r) => r.status === "pending").length,
  },
  mutations: {
    ADD_TO_CART(state, product) {
      // Pull every seller-identifier variant the marketplace might send
      // so the checkout flow always has a real seller_id to work with.
      const sellerId =
        product.sellerId ?? product.seller_id ?? product.seller?.id ?? null;

      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        // Backfill sellerId if it was missing from an older cart item.
        if (!existing.sellerId && sellerId) existing.sellerId = sellerId;
      } else {
        state.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          sellerName: product.sellerName,
          sellerId,
          quantity: 1,
        });
      }
      persist(CART_KEY, state.cart);
    },

    REMOVE_FROM_CART(state, id) {
      state.cart = state.cart.filter((item) => item.id !== id);
      persist(CART_KEY, state.cart);
    },
    CLEAR_CART(state) {
      state.cart = [];
      persist(CART_KEY, state.cart);
    },
    ADD_SWAP_REQUEST(state, request) {
      state.swapRequests.unshift(request);
      persist(SWAP_KEY, state.swapRequests);
    },
    SET_SWAP_STATUS(state, { id, status }) {
      const req = state.swapRequests.find((r) => r.id === id);
      if (req) req.status = status;
      persist(SWAP_KEY, state.swapRequests);
    },
  },
  actions: {
    addToCart({ commit }, product) {
      commit("ADD_TO_CART", product);
    },
    removeFromCart({ commit }, id) {
      commit("REMOVE_FROM_CART", id);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
    /**
     * Create a swap request. The buyer side calls this when they tap
     * "Alert seller for swap"; the seller sees it and accepts or declines.
     */
    requestSwap({ commit }, { product, buyerName }) {
      const request = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        swapFor: product.swapFor || "",
        sellerName: product.sellerName,
        buyerName: buyerName || "A student",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      commit("ADD_SWAP_REQUEST", request);
      return request;
    },
    acceptSwap({ commit }, id) {
      commit("SET_SWAP_STATUS", { id, status: "accepted" });
    },
    declineSwap({ commit }, id) {
      commit("SET_SWAP_STATUS", { id, status: "declined" });
    },
  },
};
