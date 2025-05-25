// src/store/modules/auth.js
import { auth } from '@/firebase'
import {
  updateProfile,
  updateEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail
} from 'firebase/auth'

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
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          commit('SET_USER', user)
          commit('SET_AUTH_READY', true)
          commit('SET_LOADING', false)
          commit('SET_ERROR', null)
          unsubscribe()
          resolve()
        })
      })
    },

    // Authentication Actions
    async signup({ commit }, { email, password, displayName }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        if (displayName) {
          await updateProfile(userCredential.user, { displayName })
        }
        commit('SET_USER', userCredential.user)
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        commit('SET_USER', userCredential.user)
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
        await signOut(auth)
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
        const user = auth.currentUser
        if (user) {
          await updateProfile(user, { displayName, photoURL })
          commit('SET_USER', { ...user, displayName, photoURL })
          commit('SET_NOTIFICATION', { type: 'success', message: 'Profile updated successfully!' })
          return { success: true }
        }
        throw new Error('No user is currently signed in.')
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
        const user = auth.currentUser
        if (user) {
          await verifyBeforeUpdateEmail(user, newEmail)
          commit('SET_NOTIFICATION', {
            type: 'success',
            message: 'Verification email sent. Please check your inbox to confirm your new email address.'
          })
          return { success: true }
        }
        throw new Error('No user is currently signed in.')
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
        await sendPasswordResetEmail(auth, email)
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
    userDisplayName: (state) => state.user?.displayName || '',
    userEmail: (state) => state.user?.email || '',
    userPhotoURL: (state) => state.user?.photoURL || '',
    isAuthenticated: (state) => !!state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
    authReady: (state) => state.authIsReady,
    notification: (state) => state.notification
  }
}