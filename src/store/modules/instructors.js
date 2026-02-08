import { supabase } from '@/supabase'

const state = {
  instructors: [],
  currentInstructor: null,
  loading: false,
  error: null,
}

const mutations = {
  SET_INSTRUCTORS(state, instructors) {
    state.instructors = instructors
  },
  SET_CURRENT_INSTRUCTOR(state, instructor) {
    state.currentInstructor = instructor
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchInstructors({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (error) throw error
      
      commit('SET_INSTRUCTORS', data || [])
      return data || []
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching instructors:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchInstructorById({ commit }, id) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      commit('SET_CURRENT_INSTRUCTOR', data)
      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching instructor by ID:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateInstructorProfile({ commit }, { id, updates }) {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      commit('SET_CURRENT_INSTRUCTOR', data)
      return data
    } catch (error) {
      console.error('Error updating instructor profile:', error)
      throw error
    }
  }
}

const getters = {
  allInstructors: state => state.instructors,
  featuredInstructors: state => state.instructors.filter(i => i.is_featured).slice(0, 4),
  currentInstructor: state => state.currentInstructor,
  instructorsLoading: state => state.loading,
  instructorsError: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
