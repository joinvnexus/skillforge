<template>
  <footer class="mt-16 border-t border-[var(--line)] bg-slate-950 text-slate-200">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
      <section class="md:col-span-2">
        <h3 class="text-lg font-bold tracking-tight text-white">Build Real Skills, Ship Real Products.</h3>
        <p class="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Practice with guided paths, project-first lessons, and role-based workflows that mirror production teams.
        </p>
      </section>

      <section>
        <h4 class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Explore</h4>
        <ul class="mt-4 space-y-2 text-sm">
          <li><router-link class="hover:text-white" to="/courses">Courses</router-link></li>
          <li><router-link class="hover:text-white" to="/blog">Blog</router-link></li>
          <li><router-link class="hover:text-white" to="/support">Support</router-link></li>
          <li><router-link class="hover:text-white" to="/contact">Contact</router-link></li>
        </ul>
      </section>

      <section>
        <h4 class="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Newsletter</h4>
        <p class="mt-4 text-sm text-slate-300">Get a weekly learning digest.</p>
        <form class="mt-3 flex gap-2" @submit.prevent="subscribeNewsletter">
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
          <button type="submit" class="btn-brand rounded-lg px-3 py-2 text-sm font-bold">Join</button>
        </form>
      </section>
    </div>

    <div class="border-t border-slate-800">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 md:flex-row">
        <p>&copy; {{ year }} Skillshare. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white">Privacy</a>
          <a href="#" class="hover:text-white">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      year: new Date().getFullYear()
    }
  },
  methods: {
    subscribeNewsletter() {
      alert(`Subscribed: ${this.email}`)
      this.email = ''
    }
  }
}
</script>
