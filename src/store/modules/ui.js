const state = {
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 6,
  toasts: []
}

const mutations = {
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page
  },
  PUSH_TOAST(state, toast) {
    state.toasts.push(toast)
  },
  REMOVE_TOAST(state, id) {
    state.toasts = state.toasts.filter((toast) => toast.id !== id)
  }
}

const actions = {
  changePage({ commit }, page) {
    commit('SET_CURRENT_PAGE', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  notify({ commit }, { type = 'info', message = '', timeout = 3500 } = {}) {
    const resolvedMessage = String(message || '').trim()
    if (!resolvedMessage) return null

    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
    commit('PUSH_TOAST', { id, type, message: resolvedMessage })

    if (timeout > 0) {
      setTimeout(() => {
        commit('REMOVE_TOAST', id)
      }, timeout)
    }

    return id
  },
  dismissToast({ commit }, id) {
    commit('REMOVE_TOAST', id)
  }
}

const getters = {
  paginatedCourses: (state, getters, rootState) => {
    const start = (state.currentPage - 1) * state.itemsPerPage
    const end = start + state.itemsPerPage
    return rootState.filters.filteredCourses.slice(start, end)
  },
  totalPages: (state, getters, rootState) => {
    return Math.ceil(rootState.filters.filteredCourses.length / state.itemsPerPage)
  },
  courseCount: (state, getters, rootState) => {
    return rootState.filters.filteredCourses.length
  },
  toasts: (state) => state.toasts
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
