// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export const coursesApi = {
  // Get all courses
  async getAll() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Get course by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Get courses by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
    if (error) throw error
    return data
  },

  // Get featured courses
  async getFeatured() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_featured', true)
    if (error) throw error
    return data
  },

  // Get popular courses
  async getPopular() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_popular', true)
    if (error) throw error
    return data
  },

  // Search courses
  async search(query) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .ilike('title', `%${query}%`)
    if (error) throw error
    return data
  },

  // Create course (admin only)
  async create(course) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
    if (error) throw error
    return data
  },

  // Update course (admin only)
  async update(id, course) {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
    if (error) throw error
    return data
  },

  // Delete course (admin only)
  async delete(id) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }
}

export const enrollmentsApi = {
  // Get user enrollments
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  // Enroll in a course
  async enroll(userId, courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ user_id: userId, course_id: courseId })
      .select()
    if (error) throw error
    return data
  },

  // Check if enrolled
  async isEnrolled(userId, courseId) {
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
