<template>
  <footer class="bg-[#2c3e50] text-[#ecf0f1] py-10 px-5 text-center">
    <!-- Footer Top: Links, Social Icons, and Newsletter Signup -->
    <div class="footer-top">
      <div class="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-8">
        <!-- Quick Links Section -->
        <div class="footer-links">
          <h4 class="text-[#f39c12] mb-4">Quick Links</h4>
          <ul class="list-none p-0">
            <li class="mb-2.5"><a href="#" class="text-[#ecf0f1] no-underline hover:text-[#f39c12] transition-colors duration-300">Courses</a></li>
            <li class="mb-2.5"><a href="#" class="text-[#ecf0f1] no-underline hover:text-[#f39c12] transition-colors duration-300">Blog</a></li>
            <li class="mb-2.5"><a href="#" class="text-[#ecf0f1] no-underline hover:text-[#f39c12] transition-colors duration-300">About Us</a></li>
            <li class="mb-2.5"><a href="#" class="text-[#ecf0f1] no-underline hover:text-[#f39c12] transition-colors duration-300">Contact</a></li>
          </ul>
        </div>

        <!-- Social Media Section -->
        <div class="footer-social">
          <h4 class="text-[#f39c12] mb-4">Follow Us</h4>
          <ul class="flex justify-center list-none p-0">
            <li class="mr-4"><a href="#" class="text-[#ecf0f1] text-2xl hover:text-[#f39c12] transition-colors duration-300"><i class="fab fa-twitter"></i></a></li>
            <li class="mr-4"><a href="#" class="text-[#ecf0f1] text-2xl hover:text-[#f39c12] transition-colors duration-300"><i class="fab fa-linkedin"></i></a></li>
            <li><a href="#" class="text-[#ecf0f1] text-2xl hover:text-[#f39c12] transition-colors duration-300"><i class="fab fa-facebook-f"></i></a></li>
          </ul>
        </div>

        <!-- Newsletter Signup Section -->
        <div class="footer-newsletter">
          <h4 class="text-[#f39c12] mb-4">Stay Updated</h4>
          <p class="mb-4 text-base">Subscribe to our newsletter for the latest updates on courses and blogs.</p>
          <form @submit.prevent="subscribeNewsletter" class="flex flex-wrap justify-center">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Enter your email" 
              required
              class="w-[250px] px-2.5 py-[10px] border-none rounded mr-2.5 mb-4 sm:mb-0"
            />
            <button 
              type="submit" 
              class="px-5 py-[10px] bg-[#f39c12] text-white border-none rounded cursor-pointer hover:bg-[#e67e22] transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer Bottom: Legal Information -->
    <div class="bg-[#1a252f] py-5">
      <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="legal-info mb-2 md:mb-0">
          <a href="#" class="text-[#bdc3c7] no-underline hover:text-[#f39c12] transition-colors duration-300">Privacy Policy</a>
          <span class="text-[#bdc3c7] mx-1.5">|</span>
          <a href="#" class="text-[#bdc3c7] no-underline hover:text-[#f39c12] transition-colors duration-300">Terms of Service</a>
        </div>
        <p class="text-[#bdc3c7]">&copy; 2024 Vue Academy. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    };
  },
  methods: {
    subscribeNewsletter() {
      alert(`Subscribed with: ${this.email}`);
      this.email = ''; // Clear the input field after submission
    }
  }
};
</script>