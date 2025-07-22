<template>
  <form @submit.prevent="submitCourse">
    <input v-model="course.title" placeholder="Title" required />
    <input v-model="course.category" placeholder="Category" required />
    <label>
      <input type="checkbox" v-model="course.isPopular" />
      Popular
    </label>
    <label>
      <input type="checkbox" v-model="course.isFeatured" />
      Featured
    </label>
    <button type="submit">Add Course</button>
  </form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      course: {
        title: '',
        category: '',
        isPopular: false,
        isFeatured: false,
      }
    }
  },
  methods: {
    ...mapActions('courses', ['addCourse']),
    async submitCourse() {
      try {
        await this.addCourse(this.course)
        alert('Course added successfully!')
        this.course = {
          title: '',
          category: '',
          isPopular: false,
          isFeatured: false,
        }
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }
  }
}
</script>
