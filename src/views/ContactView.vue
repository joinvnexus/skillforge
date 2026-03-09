<template>
  <section class="mx-auto max-w-7xl px-4 py-8">
    <div class="section-shell p-7 md:p-10">
      <header class="mb-8 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Contact</p>
        <h1 class="mt-2 text-4xl font-bold text-slate-900">Talk to Our Team</h1>
        <p class="mx-auto mt-3 max-w-2xl text-slate-600">
          Have a technical or course-related question? Send a message and we will respond quickly.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <form @submit.prevent="handleSubmit" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-700">First Name</label>
              <input v-model="form.firstName" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none" placeholder="John" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-700">Last Name</label>
              <input v-model="form.lastName" type="text" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none" placeholder="Doe" />
            </div>
          </div>

          <div class="mt-4">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none" placeholder="john@example.com" />
          </div>

          <div class="mt-4">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Subject</label>
            <select v-model="form.subject" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none">
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div class="mt-4">
            <label class="mb-1 block text-sm font-semibold text-slate-700">Message</label>
            <textarea v-model="form.message" rows="5" class="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-sky-500 focus:outline-none" placeholder="Your message..." />
          </div>

          <button type="submit" class="btn-brand mt-5 w-full rounded-xl py-3 text-sm">Send Message</button>
        </form>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Email</p>
            <p class="mt-2 text-base font-semibold text-slate-900">support@skillshare.com</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Phone</p>
            <p class="mt-2 text-base font-semibold text-slate-900">+1 (555) 123-4567</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Location</p>
            <p class="mt-2 text-base font-semibold text-slate-900">San Francisco, CA</p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.form)
      alert('Thank you for your message! We will get back to you soon.')
      this.form = { firstName: '', lastName: '', email: '', subject: '', message: '' }
    }
  }
}
</script>
