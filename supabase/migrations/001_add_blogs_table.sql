-- ============================================
-- Migration: 001_add_blogs_table
-- Purpose: Create blogs table for blog posts
-- Created: 2026-02-07
-- Dependencies: None (base tables only)
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    snippet TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    reading_time_minutes INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured, published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Blog RLS Policies (defined in separate file for separation of concerns)
-- See: supabase/policies/blogs_policies.sql
