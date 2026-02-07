-- ============================================
-- Migration: 000_initial_setup
-- Purpose: Base schema setup - extensions and utilities
-- Created: From refactored supabase-schema.sql
-- Dependencies: None
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: This migration establishes the foundation for all subsequent migrations.
-- All new tables should reference this as the base dependency.
