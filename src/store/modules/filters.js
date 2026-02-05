const state = {
  filteredCourses: [],
  searchQuery: '',
  selectedCategories: [],
  selectedLevels: [],
  priceRange: [0, 1000],
  sortBy: 'newest'
}

const mutations = {
  SET_FILTERED_COURSES(state, courses) {
    state.filteredCourses = courses
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  },
  SET_SELECTED_CATEGORIES(state, categories) {
    state.selectedCategories = categories
  },
  SET_SELECTED_LEVELS(state, levels) {
    state.selectedLevels = levels
  },
  SET_PRICE_RANGE(state, range) {
    state.priceRange = range
  },
  SET_SORT_BY(state, sortBy) {
    state.sortBy = sortBy
  }
}

const actions = {
  filterCourses({ commit, state, rootState }) {
    let filtered = [...rootState.courses.allCourses]

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        state.selectedCategories.includes(course.category)
      )
    }

    if (state.selectedLevels.length > 0) {
      filtered = filtered.filter(course =>
        state.selectedLevels.includes(course.level)
      )
    }

    filtered = filtered.filter(course => {
      const price = parseFloat(course.price) || 0
      return price >= state.priceRange[0] && price <= state.priceRange[1]
    })

    filtered = [...filtered].sort((a, b) => {
      if (state.sortBy === 'newest') {
        return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded)
      } else if (state.sortBy === 'popular') {
        return b.students - a.students
      } else if (state.sortBy === 'rated') {
        return b.rating - a.rating
      } else if (state.sortBy === 'price-low') {
        return a.price - b.price
      } else if (state.sortBy === 'price-high') {
        return b.price - a.price
      }
      return 0
    })

    commit('SET_FILTERED_COURSES', filtered)
    commit('ui/SET_CURRENT_PAGE', 1, { root: true })
  },
  updateSearchQuery({ commit, dispatch }, query) {
    commit('SET_SEARCH_QUERY', query)
    dispatch('filterCourses')
  },
  updateSelectedCategories({ commit, dispatch }, categories) {
    commit('SET_SELECTED_CATEGORIES', categories)
    dispatch('filterCourses')
  },
  updateSelectedLevels({ commit, dispatch }, levels) {
    commit('SET_SELECTED_LEVELS', levels)
    dispatch('filterCourses')
  },
  updatePriceRange({ commit, dispatch }, range) {
    commit('SET_PRICE_RANGE', range)
    dispatch('filterCourses')
  },
  updateSortBy({ commit, dispatch }, sortBy) {
    commit('SET_SORT_BY', sortBy)
    dispatch('filterCourses')
  },
  resetFilters({ commit, dispatch }) {
    commit('SET_SELECTED_CATEGORIES', [])
    commit('SET_SELECTED_LEVELS', [])
    commit('SET_PRICE_RANGE', [0, 1000])
    commit('SET_SEARCH_QUERY', '')
    dispatch('filterCourses')
  }
}

const getters = {
    filteredCourses: state => state.filteredCourses,

 allCategories: (state, getters, rootState) => {
  // Use categories, not tags - category is a string, not an array
  const allCategories = rootState.courses.allCourses
    .map(course => course.category)
    .filter(category => category) // Filter out null/undefined
  return [...new Set(allCategories)]
},
  allLevels: (state, getters, rootState) => {
    return [...new Set(rootState.courses.allCourses.map(course => course.level))]
  },
  hasFilters(state) {
    return (
      (state.selectedCategories && state.selectedCategories.length > 0) ||
      (state.selectedLevels && state.selectedLevels.length > 0) ||
      (state.priceRange && (state.priceRange[0] !== 0 || state.priceRange[1] !== 0)) ||
      (state.searchQuery && state.searchQuery.trim() !== '')
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}