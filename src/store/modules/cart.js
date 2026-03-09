const STORAGE_KEY = "skillshare_cart_items";

const hasWindow = typeof window !== "undefined";

const readStorage = () => {
  if (!hasWindow) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
};

const writeStorage = (items) => {
  if (!hasWindow) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const state = {
  items: readStorage()
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
    writeStorage(items);
  },
  ADD_ITEM(state, course) {
    if (!course?.id) return;
    if (state.items.some((item) => item.id === course.id)) return;
    const updated = [...state.items, course];
    state.items = updated;
    writeStorage(updated);
  },
  REMOVE_ITEM(state, courseId) {
    const updated = state.items.filter((item) => item.id !== courseId);
    state.items = updated;
    writeStorage(updated);
  },
  CLEAR_CART(state) {
    state.items = [];
    writeStorage([]);
  }
};

const actions = {
  initializeCart({ commit }) {
    commit("SET_ITEMS", readStorage());
  },
  addToCart({ commit }, course) {
    commit("ADD_ITEM", course);
  },
  removeFromCart({ commit }, courseId) {
    commit("REMOVE_ITEM", courseId);
  },
  clearCart({ commit }) {
    commit("CLEAR_CART");
  },
  async checkoutCart({ state, dispatch }, payload = {}) {
    if (!state.items.length) return null;
    const courseIds = state.items.map((item) => item.id);
    const order = await dispatch(
      "orders/createOrder",
      {
        courseIds,
        paymentMethod: payload.paymentMethod || "CARD",
        markPaid: payload.markPaid !== undefined ? payload.markPaid : false
      },
      { root: true }
    );
    dispatch("clearCart");
    return order;
  }
};

const getters = {
  cartItems: (state) => state.items,
  cartCount: (state) => state.items.length,
  cartSubtotal: (state) => state.items.reduce((sum, item) => sum + Number(item.price || 0), 0),
  inCart: (state) => (courseId) => state.items.some((item) => item.id === courseId)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
