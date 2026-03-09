import { apiRequest, clearStoredSession, getStoredSession, setStoredSession } from '@/lib/api'
import { normalizeUser } from '@/lib/normalizers'

export default {
  namespaced: true,
  state: () => ({
    user: null,
    authIsReady: false,
    error: null,
    loading: false,
    notification: null,
    initialized: false
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
    },
    SET_INITIALIZED(state, initialized) {
      state.initialized = initialized
    }
  },
  actions: {
    async initializeAuth({ state, commit }) {
      if (state.initialized) {
        commit('SET_AUTH_READY', true)
        return
      }

      const { accessToken } = getStoredSession()

      if (!accessToken) {
        commit('SET_USER', null)
        commit('SET_AUTH_READY', true)
        commit('SET_INITIALIZED', true)
        return
      }

      try {
        const response = await apiRequest('/auth/me', { auth: true })
        commit('SET_USER', normalizeUser(response.data))
      } catch (error) {
        clearStoredSession()
        commit('SET_USER', null)
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_AUTH_READY', true)
        commit('SET_INITIALIZED', true)
      }
    },

    async signup({ commit }, { email, password, displayName, role = 'STUDENT' }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await apiRequest('/auth/register', {
          method: 'POST',
          body: {
            name: displayName,
            email,
            password,
            role
          }
        })

        setStoredSession({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        })
        commit('SET_USER', normalizeUser(response.data.user))
        commit('SET_NOTIFICATION', { type: 'success', message: 'Account created successfully.' })
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
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: {
            email,
            password
          }
        })

        setStoredSession({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        })
        commit('SET_USER', normalizeUser(response.data.user))
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
        const { refreshToken } = getStoredSession()

        if (refreshToken) {
          await apiRequest('/auth/logout', {
            method: 'POST',
            body: { refreshToken }
          })
        }

        clearStoredSession()
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

    async updateProfile({ commit }, { displayName, photoURL }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await apiRequest('/student/me/profile', {
          method: 'PATCH',
          auth: true,
          body: {
            ...(displayName !== undefined ? { name: displayName } : {}),
            ...(photoURL !== undefined ? { avatarUrl: photoURL } : {})
          }
        })

        commit('SET_USER', normalizeUser(response.data))
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
        throw new Error(`Email update is not implemented yet. Requested email: ${newEmail}`)
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await apiRequest('/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })
        commit('SET_NOTIFICATION', { type: 'success', message: response.data?.message || 'Password reset link generated.' })
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async resetPassword({ commit }, { token, newPassword }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await apiRequest('/auth/reset-password', {
          method: 'POST',
          body: { token, newPassword }
        })
        commit('SET_NOTIFICATION', { type: 'success', message: response.data?.message || 'Password reset successful.' })
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_NOTIFICATION', { type: 'error', message: error.message })
        return { success: false, error: error.message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateUserProfile({ dispatch }, payload) {
      return dispatch('updateProfile', payload)
    },

    clearNotification({ commit }) {
      commit('CLEAR_NOTIFICATION')
    }
  },
  getters: {
    currentUser: (state) => state.user,
    userDisplayName: (state) => state.user?.displayName || state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    userPhotoURL: (state) => state.user?.photoURL || state.user?.avatarUrl || '',
    userRole: (state) => state.user?.role || 'STUDENT',
    isAuthenticated: (state) => !!state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
    authReady: (state) => state.authIsReady,
    notification: (state) => state.notification
  }
}
