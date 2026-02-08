-- ============================================
-- Migration: 000_initial_setup
-- Purpose: Base schema setup - extensions and utilities
-- Created: From refactored supabase-schema.sql
-- Dependencies: None
-- ============================================

-- Note: gen_random_uuid() is built into PostgreSQL 13+
-- No extension needed - it's available automatically in the public schema

-- Note: This migration establishes the foundation for all subsequent migrations.
-- All new tables should reference this as the base dependency.
