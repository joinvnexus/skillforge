<template>
  <article class="admin-card p-5 lg:col-span-2">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Admin Settings</h2>
        <p class="text-xs text-slate-500">Manage profile, account, and security preferences.</p>
      </div>
      <button class="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
        Save Changes
      </button>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 p-4">
        <h3 class="text-sm font-semibold text-slate-800">Profile Settings</h3>
        <p class="mt-1 text-xs text-slate-500">Update your admin profile details.</p>
        <div class="mt-4 grid gap-3">
          <div>
            <label class="text-xs font-semibold text-slate-600">Full Name</label>
            <input type="text" placeholder="Admin name" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Email</label>
            <input type="email" placeholder="admin@skillshare.com" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Role</label>
            <input type="text" disabled value="ADMIN" class="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">Profile Photo</label>
            <input type="file" class="mt-1 w-full rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 p-4">
        <h3 class="text-sm font-semibold text-slate-800">Account & Security</h3>
        <p class="mt-1 text-xs text-slate-500">Keep your account protected.</p>
        <div class="mt-4 grid gap-3">
          <div>
            <label class="text-xs font-semibold text-slate-600">Current Password</label>
            <input type="password" placeholder="********" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">New Password</label>
            <input type="password" placeholder="********" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <div>
              <p class="text-xs font-semibold text-slate-700">Two-Factor Auth</p>
              <p class="text-xs text-slate-500">Require OTP on login.</p>
            </div>
            <input type="checkbox" />
          </div>
          <div class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <div>
              <p class="text-xs font-semibold text-slate-700">Login Alerts</p>
              <p class="text-xs text-slate-500">Email on new device login.</p>
            </div>
            <input type="checkbox" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold text-slate-600">Notification Preferences</p>
        <p class="mt-2 text-sm text-slate-600">Weekly reports, critical alerts, and policy updates.</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold text-slate-600">System Defaults</p>
        <p class="mt-2 text-sm text-slate-600">Manage global settings for students and instructors.</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold text-slate-600">Security Logs</p>
        <p class="mt-2 text-sm text-slate-600">View recent admin activity and audit trail.</p>
      </div>
    </div>
  </article>
</template>
