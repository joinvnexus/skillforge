-- ============================================
-- Seed Data: blogs
-- Purpose: Insert sample blog posts converted from JSON
-- Created: 2026-02-07
-- Table: blogs
-- ============================================

-- Note: Run this after migration 001_add_blogs_table.sql
-- Note_id will be NULL: author if profiles don't exist yet - this is acceptable

INSERT INTO blogs (title, slug, snippet, content, image, author, published_at, is_published, is_featured, tags, reading_time_minutes) VALUES
(
    'Master Vue.js with Expert Guidance',
    'master-vuejs-expert-guidance',
    'Discover the best techniques to become proficient in Vue.js, starting from basics to advanced.',
    '# Master Vue.js with Expert Guidance

Discover the best techniques to become proficient in Vue.js, starting from basics to advanced concepts.

## Introduction

Vue.js is one of the most popular JavaScript frameworks for building user interfaces. In this comprehensive guide, we will explore everything you need to know to master Vue.js.

## Key Concepts

- **Reactive Data Binding**: Vue.js uses a reactive system to keep your UI in sync with your data.
- **Components**: Build reusable UI components with well-defined interfaces.
- **Directives**: Use built-in directives like v-if, v-for, and v-bind to manipulate the DOM.

## Getting Started

Start by setting up your development environment and creating your first Vue application.',
    'https://picsum.photos/id/28/367/267',
    'Jane Doe',
    '2023-05-15'::TIMESTAMP WITH TIME ZONE,
    true,
    true,
    ARRAY['Vue', 'Frontend', 'JavaScript'],
    8
),
(
    'Top 10 Vue.js Tips and Tricks',
    'top-10-vuejs-tips-tricks',
    'Enhance your Vue.js skills with these top tips and tricks from industry experts.',
    '# Top 10 Vue.js Tips and Tricks

Enhance your Vue.js skills with these top tips and tricks from industry experts.

## 1. Use Computed Properties Wisely

Computed properties are cached based on their dependencies. Use them for calculations that need to update when dependencies change.

## 2. Leverage Watchers for Side Effects

Use watchers when you need to perform side effects in response to data changes.

## 3. Component Reusability

Design components with reusability in mind. Use props for configuration and slots for content projection.',
    'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80',
    'John Smith',
    '2023-05-10'::TIMESTAMP WITH TIME ZONE,
    true,
    false,
    ARRAY['Vue', 'Tips', 'Best Practices'],
    6
),
(
    'Building a Vue.js Project from Scratch',
    'building-vuejs-project-scratch',
    'A step-by-step guide to building your first Vue.js project, from setup to deployment.',
    '# Building a Vue.js Project from Scratch

A step-by-step guide to building your first Vue.js project, from setup to deployment.

## Prerequisites

Before we begin, make sure you have Node.js installed on your machine.

## Step 1: Create a New Project

Use Vue CLI or Vite to create a new project:

```bash
npm create vue@latest
```

## Step 2: Project Structure

Learn about the standard Vue.js project structure and what each file does.',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80',
    'Alice Johnson',
    '2023-05-05'::TIMESTAMP WITH TIME ZONE,
    true,
    true,
    ARRAY['Vue', 'Tutorial', 'Beginner'],
    12
),
(
    'Vue 3 Composition API Deep Dive',
    'vue3-composition-api-deep-dive',
    'Learn how to leverage the new Composition API in Vue 3 for better code organization.',
    '# Vue 3 Composition API Deep Dive

Learn how to leverage the new Composition API in Vue 3 for better code organization.

## What is the Composition API?

The Composition API is a set of additive APIs that allow for flexible composition of component logic.

## Key Benefits

- Better TypeScript support
- More flexible code organization
- Improved logic reuse',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    'Bob Wilson',
    '2023-04-28'::TIMESTAMP WITH TIME ZONE,
    true,
    false,
    ARRAY['Vue', 'Composition API', 'Vue 3'],
    10
),
(
    'Advanced Vue.js Patterns',
    'advanced-vuejs-patterns',
    'Explore advanced patterns and best practices to write maintainable Vue.js applications.',
    '# Advanced Vue.js Patterns

Explore advanced patterns and best practices to write maintainable Vue.js applications.

## State Management

Learn about Vuex and Pinia for managing application state.

## Performance Optimization

Discover techniques to optimize your Vue.js applications for better performance.

## Testing Strategies

Implement comprehensive testing strategies for your Vue applications.',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    'Clara Davis',
    '2023-04-20'::TIMESTAMP WITH TIME ZONE,
    true,
    false,
    ARRAY['Vue', 'Advanced', 'Patterns'],
    15
)
ON CONFLICT (slug) DO NOTHING;

-- Verify seed data
SELECT 'Blogs seeded successfully' as status, COUNT(*) as count FROM blogs;
