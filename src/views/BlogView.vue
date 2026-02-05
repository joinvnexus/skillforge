<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest news, tutorials, and insights from our team.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover" />
          <div class="p-6">
            <span class="text-sm text-blue-600 font-medium">{{ post.category }}</span>
            <h3 class="text-xl font-semibold text-gray-900 mt-2 mb-3">{{ post.title }}</h3>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">{{ post.date }}</span>
              <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Read More →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogView',
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Getting Started with Vue.js 3',
          excerpt: 'Learn the fundamentals of Vue.js 3 and start building modern web applications.',
          category: 'Tutorial',
          date: 'Jan 15, 2024',
          image: 'https://picsum.photos/id/1/400/300'
        },
        {
          id: 2,
          title: 'Best Practices for State Management',
          excerpt: 'Discover the best practices for managing state in large-scale Vue applications.',
          category: 'Best Practices',
          date: 'Jan 10, 2024',
          image: 'https://picsum.photos/id/2/400/300'
        },
        {
          id: 3,
          title: 'Building Responsive Layouts with Tailwind',
          excerpt: 'Master responsive design using Tailwind CSS utility classes.',
          category: 'Design',
          date: 'Jan 5, 2024',
          image: 'https://picsum.photos/id/3/400/300'
        }
      ]
    }
  }
}
</script>
