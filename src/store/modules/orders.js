import { apiRequest } from "@/lib/api";

const state = {
  items: [],
  loading: false,
  error: null,
  latestOrder: null
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  ADD_ORDER(state, order) {
    state.items.unshift(order);
    state.latestOrder = order;
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
  }
};

const getters = {
  orders: (state) => state.items,
  latestOrder: (state) => state.latestOrder
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
