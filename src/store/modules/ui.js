const state = {
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 6
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
  }
}

const actions = {
  changePage({ commit }, page) {
    commit('SET_CURRENT_PAGE', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
