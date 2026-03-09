import { apiRequest } from "@/lib/api";
import { normalizeCourse } from "@/lib/normalizers";

const state = {
  items: [],
  loading: false,
  error: null
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  ADD_ITEM(state, course) {
    if (!state.items.some((item) => item.id === course.id)) {
      state.items.unshift(course);
    }
  },
  REMOVE_ITEM(state, courseId) {
    state.items = state.items.filter((item) => item.id !== courseId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

const actions = {
  async fetchWishlist({ commit }) {
    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      const response = await apiRequest("/student/me/wishlist", { auth: true });
      const courses = (response.data || []).map((item) => normalizeCourse(item.course));
      commit("SET_ITEMS", courses);
      return courses;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async addToWishlist({ commit }, course) {
    const courseId = course?.id || course;
    if (!courseId) return;

    try {
      commit("SET_ERROR", null);
      await apiRequest("/student/me/wishlist", {
        method: "POST",
        auth: true,
        body: { courseId }
      });
      if (course?.id) {
        commit("ADD_ITEM", course);
      }
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    }
  },

  async removeFromWishlist({ commit }, courseId) {
    if (!courseId) return;
    try {
      commit("SET_ERROR", null);
      await apiRequest(`/student/me/wishlist/${courseId}`, {
        method: "DELETE",
        auth: true
      });
      commit("REMOVE_ITEM", courseId);
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    }
  }
};

const getters = {
  wishlistItems: (state) => state.items,
  wishlistCount: (state) => state.items.length,
  isWishlisted: (state) => (courseId) => state.items.some((item) => item.id === courseId)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
