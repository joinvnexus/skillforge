import { apiRequest } from '@/lib/api'
import { normalizeLearningPath } from '@/lib/normalizers'

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
      
      const response = await apiRequest('/learning-paths')
      const paths = (response.data || []).map(normalizeLearningPath)

      commit('SET_PATHS', paths)
      return paths
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching all paths:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPathBySlug({ commit }, slug) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      commit('SET_CURRENT_PATH', null)
      
      const response = await apiRequest(`/learning-paths/${slug}`)
      const path = normalizeLearningPath(response.data)

      commit('SET_CURRENT_PATH', path)
      return path
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
      
      const response = await apiRequest(`/learning-paths?level=${encodeURIComponent(level)}`)
      return (response.data || []).map(normalizeLearningPath)
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
      
      const response = await apiRequest('/home')
      const featuredPaths = (response.data?.featuredLearningPaths || []).map(normalizeLearningPath)

      commit('SET_PATHS', featuredPaths)
      return featuredPaths
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
  featuredPaths: state => state.allPaths.filter(p => p.isFeatured).slice(0, 3),
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
