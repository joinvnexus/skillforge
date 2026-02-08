import { supabase } from '@/supabase'

const state = {
  allPaths: [],
  currentPath: null,
  isLoading: false,
  error: null
}

const mutations = {
  SET_PATHS(state, paths) {
    state.allPaths = paths
  },
  SET_CURRENT_PATH(state, path) {
    state.currentPath = path
  },
  SET_LOADING(state, status) {
    state.isLoading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchAllPaths({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .order('display_order')
      
      if (error) throw error
      
      commit('SET_PATHS', data || [])
      return data || []
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching all paths:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPathBySlug({ commit, dispatch }, slug) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      commit('SET_CURRENT_PATH', null)
      
      // First try to fetch directly by slug
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        // If error is "PGRST116" (not found), try loading all paths and finding locally
        if (error.code === 'PGRST116') {
          console.warn(`Path with slug "${slug}" not found directly, trying local search...`)
          
          // Load all paths if not already loaded
          const paths = await dispatch('fetchAllPaths')
          const path = paths.find(p => p.slug === slug)
          
          if (!path) {
            throw new Error(`Learning path "${slug}" not found. Please ensure the migrations and seed data have been run.`)
          }
          
          commit('SET_CURRENT_PATH', path)
          return path
        }
        throw error
      }
      
      commit('SET_CURRENT_PATH', data)
      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error(`Error fetching path "${slug}":`, error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPathsByLevel({ commit }, level) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .eq('level', level)
        .order('display_order')
      
      if (error) throw error
      
      return data || []
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching paths by level:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchFeaturedPaths({ commit }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('display_order')
        .limit(3)
      
      if (error) throw error
      
      commit('SET_PATHS', data || [])
      return data || []
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching featured paths:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  allPaths: state => state.allPaths,
  currentPath: state => state.currentPath,
  beginnerPaths: state => state.allPaths.filter(p => p.level === 'beginner'),
  intermediatePaths: state => state.allPaths.filter(p => p.level === 'intermediate'),
  advancedPaths: state => state.allPaths.filter(p => p.level === 'advanced'),
  featuredPaths: state => state.allPaths.filter(p => p.is_featured).slice(0, 3),
  pathsLoading: state => state.isLoading,
  pathsError: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
