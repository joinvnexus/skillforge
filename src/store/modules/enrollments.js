// src/store/modules/enrollments.js
import { enrollmentsApi } from '@/supabase'

const state = {
  enrolledCourses: [],
  loading: false,
  error: null
}

const mutations = {
  SET_ENROLLED_COURSES(state, courses) {
    state.enrolledCourses = courses
  },
  ADD_ENROLLED_COURSE(state, course) {
    state.enrolledCourses.push(course)
  },
  UPDATE_COURSE_PROGRESS(state, { courseId, progress }) {
    const course = state.enrolledCourses.find(c => c.id === courseId)
    if (course) {
      course.progress = progress
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchEnrolledCourses({ commit }, userId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const enrollments = await enrollmentsApi.getByUser(userId)
      const courses = enrollments.map(e => ({
        ...e.courses,
        enrolled_at: e.enrolled_at,
        progress: e.progress || 0,
        completed_at: e.completed_at
      }))
      
      commit('SET_ENROLLED_COURSES', courses)
      return courses
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async enrollInCourse({ commit, state }, { userId, courseId, courseData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const enrollment = await enrollmentsApi.enroll(userId, courseId)
      
      if (enrollment && enrollment.length > 0) {
        const newCourse = {
          ...courseData,
          enrolled_at: enrollment[0].enrolled_at,
          progress: 0,
          completed_at: null
        }
        commit('ADD_ENROLLED_COURSE', newCourse)
      }
      
      return enrollment
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async checkEnrollment({ commit }, { userId, courseId }) {
    try {
      commit('SET_ERROR', null)
      return await enrollmentsApi.isEnrolled(userId, courseId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async updateProgress({ commit }, { enrollmentId, progress }) {
    try {
      // This would call an API to update progress
      commit('UPDATE_COURSE_PROGRESS', { courseId: enrollmentId, progress })
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  }
}

const getters = {
  getEnrolledCourses: state => state.enrolledCourses,
  isEnrolled: state => courseId => state.enrolledCourses.some(c => c.id === courseId),
  getEnrolledCourseById: state => courseId => state.enrolledCourses.find(c => c.id === courseId),
  getTotalProgress: state => {
    if (state.enrolledCourses.length === 0) return 0
    const total = state.enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0)
    return Math.round(total / state.enrolledCourses.length)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
