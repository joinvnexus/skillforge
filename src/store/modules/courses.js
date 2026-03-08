import { apiRequest } from '@/lib/api'
import { normalizeCourse } from '@/lib/normalizers'

const state = {
  allCourses: [],
  currentCourse: null,
  relatedCourses: [],
  popularCourses: [],
  featuredCourses: []
}

const mutations = {
  SET_COURSES(state, courses) {
    state.allCourses = courses
  },
  SET_CURRENT_COURSE(state, course) {
    state.currentCourse = course
  },
  SET_RELATED_COURSES(state, courses) {
    state.relatedCourses = courses
  },
  SET_POPULAR_COURSES(state, courses) {
    state.popularCourses = courses
  },
  SET_FEATURED_COURSES(state, courses) {
    state.featuredCourses = courses
  }
}

const actions = {
  async fetchCourses({ commit, dispatch }) {
    try {
      commit('ui/SET_LOADING', true, { root: true })
      const response = await apiRequest('/courses')
      const courses = response.data.map(normalizeCourse)

      commit('SET_COURSES', courses)
      commit('SET_POPULAR_COURSES', courses.filter((course) => course.isPopular))
      commit('SET_FEATURED_COURSES', courses.filter((course) => course.isFeatured))
      dispatch('filters/filterCourses', null, { root: true })

      return courses
    } catch (error) {
      commit('ui/SET_ERROR', error.message, { root: true })
      throw error
    } finally {
      commit('ui/SET_LOADING', false, { root: true })
    }
  },

  async fetchCourseById({ commit, state }, courseId) {
    try {
      commit('ui/SET_LOADING', true, { root: true })
      const response = await apiRequest(`/courses/${courseId}`)
      const course = normalizeCourse(response.data)
      const relatedCourses = (response.relatedCourses || []).map(normalizeCourse)

      commit('SET_CURRENT_COURSE', course)
      if (relatedCourses.length > 0) {
        commit('SET_RELATED_COURSES', relatedCourses)
      } else if (course && course.category) {
        commit(
          'SET_RELATED_COURSES',
          state.allCourses.filter((item) => item.category === course.category && item.id !== courseId).slice(0, 4)
        )
      } else {
        commit('SET_RELATED_COURSES', [])
      }

      return course
    } catch (error) {
      commit('ui/SET_ERROR', error.message, { root: true })
      throw error
    } finally {
      commit('ui/SET_LOADING', false, { root: true })
    }
  },

  async searchCourses({ commit }, query) {
    try {
      commit('ui/SET_LOADING', true, { root: true })
      const response = await apiRequest(`/courses?search=${encodeURIComponent(query)}`)
      return response.data.map(normalizeCourse)
    } catch (error) {
      commit('ui/SET_ERROR', error.message, { root: true })
      throw error
    } finally {
      commit('ui/SET_LOADING', false, { root: true })
    }
  },

  async fetchCoursesByCategory({ commit }, category) {
    try {
      commit('ui/SET_LOADING', true, { root: true })
      const response = await apiRequest(`/courses?category=${encodeURIComponent(category)}`)
      return response.data.map(normalizeCourse)
    } catch (error) {
      commit('ui/SET_ERROR', error.message, { root: true })
      throw error
    } finally {
      commit('ui/SET_LOADING', false, { root: true })
    }
  }
}

const getters = {
  getPopularCourses: (state) => state.popularCourses,
  getFeaturedCourses: (state) => state.featuredCourses.slice(0, 3),
  getCourseById: (state) => (id) => state.allCourses.find((course) => course.id === id),
  relatedCourses: (state) => state.relatedCourses
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
