import { apiRequest } from '@/lib/api'
import { normalizeTestimonial } from '@/lib/normalizers'

const state = {
  testimonials: [],
  loading: false,
  error: null
}

const mutations = {
  SET_TESTIMONIALS(state, testimonials) {
    state.testimonials = testimonials
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_TESTIMONIAL(state, testimonial) {
    state.testimonials.unshift(testimonial)
  }
}

const actions = {
  async fetchTestimonials({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await apiRequest('/testimonials')
      const testimonials = (response.data || []).map(normalizeTestimonial)

      commit('SET_TESTIMONIALS', testimonials)
      return testimonials
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching testimonials:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchFeaturedTestimonials({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await apiRequest('/testimonials?featured=true')
      const testimonials = (response.data || []).map(normalizeTestimonial).slice(0, 4)

      commit('SET_TESTIMONIALS', testimonials)
      return testimonials
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching featured testimonials:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTestimonial({ commit }, testimonial) {
    try {
      throw new Error('Public testimonial create endpoint is not implemented yet')
    } catch (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }
  },

  async fetchTestimonialsByCourse({ commit }, courseId) {
    try {
      commit('SET_LOADING', true)
      
      const response = await apiRequest(`/testimonials?courseId=${encodeURIComponent(courseId)}`)
      return (response.data || []).map(normalizeTestimonial)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching testimonials by course:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTestimonialsByLearningPath({ commit }, learningPathId) {
    try {
      commit('SET_LOADING', true)
      
      const response = await apiRequest(
        `/testimonials?learningPathId=${encodeURIComponent(learningPathId)}`
      )
      return (response.data || []).map(normalizeTestimonial)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching testimonials by learning path:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  allTestimonials: state => state.testimonials,
  featuredTestimonials: state => state.testimonials.filter(t => t.is_featured).slice(0, 4),
  testimonialsLoading: state => state.loading,
  testimonialsError: state => state.error,
  isUsingFallback: () => false
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
