// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('Supabase URL not configured. Please set VITE_SUPABASE_URL in your .env file.')
}

if (!supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('Supabase anon key not configured. Please set VITE_SUPABASE_ANON_KEY in your .env file.')
}

// Only create client if both values are properly configured
export const supabase = (supabaseUrl && supabaseKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseKey.length > 0) 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Database helper functions
export const coursesApi = {
  async getAll() {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getById(id) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByCategory(category) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
    if (error) throw error
    return data || []
  },

  async getFeatured() {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
    if (error) throw error
    return data || []
  },

  async getPopular() {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_popular', true)
    if (error) throw error
    return data || []
  },

  async search(query) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .ilike('title', `%${query}%`)
    if (error) throw error
    return data || []
  },

  async create(course) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
    if (error) throw error
    return data
  },

  async update(id, course) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
    if (error) throw error
    return data
  },

  async delete(id) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }
}

// 
export const enrollmentsApi = {
  async getByUser(userId) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId)
    if (error) throw error
    return data || []
  },

  async enroll(userId, courseId) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
    if (error) throw error
    return data
  },

  async isEnrolled(userId, courseId) {
    if (!supabase) throw new Error('Supabase not configured. Please add your credentials to .env file.')
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
}
