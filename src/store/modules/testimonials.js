import { supabase } from '@/supabase'

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
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      commit('SET_TESTIMONIALS', data || [])
      return data || []
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
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(4)
      
      if (error) throw error
      
      commit('SET_TESTIMONIALS', data || [])
      return data || []
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
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single()
      
      if (error) throw error
      
      // Note: New testimonials start unapproved, so won't appear in public lists
      commit('ADD_TESTIMONIAL', data)
      return data
    } catch (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }
  },

  async fetchTestimonialsByCourse({ commit }, courseId) {
    try {
      commit('SET_LOADING', true)
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('course_id', courseId)
        .order('rating', { ascending: false })
      
      if (error) throw error
      
      return data
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
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('learning_path_id', learningPathId)
        .order('rating', { ascending: false })
      
      if (error) throw error
      
      return data
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
