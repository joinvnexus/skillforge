<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <h2 class="text-4xl font-bold text-gray-800 mb-10 text-center">Latest Articles</h2>

      <!-- Blog Post Previews Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in featuredPosts" 
          :key="post.id"
          class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          @click="viewPost(post)"
        >
          <!-- Blog Image -->
          <div class="h-48 overflow-hidden">
            <img 
              :src="post.image" 
              :alt="post.title" 
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <!-- Blog Content -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ post.title }}</h3>
            <p class="text-gray-600 mb-4">{{ post.snippet }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ formatDate(post.date) }}</span>
              <button 
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                @click.stop="viewPost(post)"
              >
                Read More
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- View All Button -->
      <div class="flex justify-center mt-10">
         <div class="mt-10 text-center">
           <router-link
          to="/blog"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          View All Articles 
          <svg class="ml-3 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
           </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
//  import { format } from 'date-fns'

export default {
  name: "BlogCard",
  computed: {
    ...mapGetters('blog', ['featuredPosts'])
  },
  created() {
    this.$store.dispatch('blog/fetchPosts')
  },
  methods: {
    viewPost(post) {
      this.$router.push({ name: 'BlogPost', params: { id: post.id } })
    },
    formatDate(dateString) {
      //return format(new Date(dateString), 'MMMM d, yyyy')
    }
  }
}
</script>