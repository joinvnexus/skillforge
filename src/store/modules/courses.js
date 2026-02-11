// src/store/modules/courses.js
import { coursesApi } from '@/supabase'

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
      const courses = await coursesApi.getAll()
      
      commit('SET_COURSES', courses)
      commit('SET_POPULAR_COURSES', courses.filter(course => course.is_popular))
      commit('SET_FEATURED_COURSES', courses.filter(course => course.is_featured))
      
      // Update filtered courses after fetching
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
      const course = await coursesApi.getById(courseId)
      commit('SET_CURRENT_COURSE', course)
      
      // Find related courses by category
      if (course && course.category) {
        const relatedCourses = state.allCourses.filter(
          c => c.category === course.category && c.id !== courseId
        ).slice(0, 4)
        commit('SET_RELATED_COURSES', relatedCourses)
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
      const courses = await coursesApi.search(query)
      return courses
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
      const courses = await coursesApi.getByCategory(category)
      return courses
    } catch (error) {
      commit('ui/SET_ERROR', error.message, { root: true })
      throw error
    } finally {
      commit('ui/SET_LOADING', false, { root: true })
    }
  }
}

const getters = {
  getPopularCourses: state => state.popularCourses,
  getFeaturedCourses: state => state.featuredCourses.slice(0, 3),
  getCourseById: state => id => state.allCourses.find(course => course.id === id),
  relatedCourses: state => state.relatedCourses
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
