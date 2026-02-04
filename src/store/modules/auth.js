// src/store/modules/auth.js
import { supabase } from '@/supabase'

export default {
  namespaced: true,
  state: () => ({
    user: null,
    authIsReady: false,
    error: null,
    loading: false,
    notification: null
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_AUTH_READY(state, isReady) {
      state.authIsReady = isReady
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading
    },
    SET_NOTIFICATION(state, notification) {
      state.notification = notification
    },
    CLEAR_NOTIFICATION(state) {
      state.notification = null
    }
  },
  actions: {
    async initializeAuth({ commit }) {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      commit('SET_USER', session?.user || null)
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        commit('SET_USER', session?.user || null)
        commit('SET_AUTH_READY', true)
      })
      
      commit('SET_AUTH_READY', true)
      return () => subscription.unsubscribe()
    },

    // Authentication Actions
    async signup({ commit }, { email, password, displayName }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { displayName }
          }
        })
        if (error) throw error
        commit('SET_USER', data.user)
        commit('SET_NOTIFICATION', { type: 'success', message: 'Account created successfully!' })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async login({ commit }, { email, password }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        commit('SET_USER', data.user)
        commit('SET_NOTIFICATION', { type: 'success', message: 'Logged in successfully!' })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      commit('SET_LOADING', true)
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        commit('SET_USER', null)
        commit('SET_NOTIFICATION', { type: 'success', message: 'Logged out successfully!' })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Profile Management
    async updateProfile({ commit }, { displayName, photoURL }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: { displayName, photoURL }
        })
        if (error) throw error
        commit('SET_USER', data.user)
        commit('SET_NOTIFICATION', { type: 'success', message: 'Profile updated successfully!' })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateEmail({ commit }, newEmail) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { error } = await supabase.auth.updateUser({ email: newEmail })
        if (error) throw error
        commit('SET_NOTIFICATION', {
          type: 'success',
          message: 'Verification email sent. Please check your inbox to confirm your new email address.'
        })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Password Management
    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        commit('SET_NOTIFICATION', {
          type: 'success',
          message: 'Password reset email sent. Please check your inbox.'
        })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Notification Management
    clearNotification({ commit }) {
      commit('CLEAR_NOTIFICATION')
    }
  },
  getters: {
    currentUser: (state) => state.user,
    userDisplayName: (state) => state.user?.user_metadata?.displayName || state.user?.displayName || '',
    userEmail: (state) => state.user?.email || '',
    userPhotoURL: (state) => state.user?.user_metadata?.photoURL || state.user?.photoURL || '',
    isAuthenticated: (state) => !!state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
    authReady: (state) => state.authIsReady,
    notification: (state) => state.notification
  }
}
