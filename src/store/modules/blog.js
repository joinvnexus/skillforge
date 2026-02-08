import { supabase } from '@/supabase'

const state = {
  posts: [],
  loading: false,
  error: null
}

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  ADD_POST(state, post) {
    state.posts.push(post)
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchPosts({ commit }) {
    try {
      commit('SET_LOADING', true)
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      
      if (error) throw error
      
      commit('SET_POSTS', data)
      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching posts:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchFeaturedPosts({ commit }) {
    try {
      commit('SET_LOADING', true)
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3)
      
      if (error) throw error
      
      commit('SET_POSTS', data)
      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching featured posts:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPostBySlug({ commit }, slug) {
    try {
      commit('SET_LOADING', true)
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      
      return data
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching post by slug:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createPost({ commit }, post) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([post])
        .select()
        .single()
      
      if (error) throw error
      
      commit('ADD_POST', data)
      return data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  async incrementViewCount(_, slug) {
    try {
      const { error } = await supabase.rpc('increment_blog_view_count', {
        blog_uuid: (await supabase
          .from('blogs')
          .select('id')
          .eq('slug', slug)
          .single()
        ).data?.id
      })
      
      if (error) console.warn('Could not increment view count:', error)
    } catch (error) {
      console.warn('Error incrementing view count:', error)
    }
  }
}

const getters = {
  allPosts: state => state.posts,
  featuredPosts: state => state.posts.filter(p => p.is_featured).slice(0, 3),
  postsLoading: state => state.loading,
  postsError: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
