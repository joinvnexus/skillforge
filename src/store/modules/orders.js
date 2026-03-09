import { apiRequest } from "@/lib/api";

const state = {
  items: [],
  loading: false,
  error: null,
  latestOrder: null,
  paymentIntents: {},
  selectedOrder: null
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  ADD_ORDER(state, order) {
    state.items.unshift(order);
    state.latestOrder = order;
  },
  UPDATE_ORDER(state, order) {
    state.items = state.items.map((item) => (item.id === order.id ? order : item));
    state.latestOrder = order;
  },
  SET_PAYMENT_INTENT(state, intent) {
    if (!intent?.orderId) return;
    state.paymentIntents = {
      ...state.paymentIntents,
      [intent.orderId]: intent
    };
  },
  SET_SELECTED_ORDER(state, order) {
    state.selectedOrder = order;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchOrders({ commit }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest("/student/me/orders", { auth: true });
      commit("SET_ITEMS", response.data || []);
      return response.data || [];
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchOrderById({ commit }, orderId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest(`/student/me/orders/${orderId}`, { auth: true });
      commit("SET_SELECTED_ORDER", response.data);
      commit("UPDATE_ORDER", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createOrder({ commit }, payload) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest("/student/me/orders", {
        method: "POST",
        auth: true,
        body: payload
      });
      commit("ADD_ORDER", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async payOrder({ commit }, { orderId, paymentMethod = "CARD", paymentReference = null }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest(`/student/me/orders/${orderId}/pay`, {
        method: "POST",
        auth: true,
        body: {
          paymentMethod,
          paymentReference
        }
      });
      commit("UPDATE_ORDER", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createPaymentIntent({ commit }, orderId) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest(`/student/me/orders/${orderId}/payment-intent`, {
        method: "POST",
        auth: true
      });
      commit("SET_PAYMENT_INTENT", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async verifyPayment({ commit }, { orderId, paymentReference, outcome = "SUCCESS", paymentMethod = "CARD" }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest(`/student/me/orders/${orderId}/payment-verify`, {
        method: "POST",
        auth: true,
        body: {
          paymentReference,
          outcome,
          paymentMethod
        }
      });
      commit("UPDATE_ORDER", response.data);
      return response.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  }
};

const getters = {
  orders: (state) => state.items,
  latestOrder: (state) => state.latestOrder,
  selectedOrder: (state) => state.selectedOrder
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
