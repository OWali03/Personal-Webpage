<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const SESSION_STORAGE_KEY = 'auth_permissions';

// Check if user is authorized (client-side)
function isAuthorized(): boolean {
  try {
    const authData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!authData) {
      return false;
    }

    const parsed = JSON.parse(authData);
    if (!parsed.permissions || !Array.isArray(parsed.permissions)) {
      return false;
    }

    // Check if /food is in the permissions array
    return parsed.permissions.includes('/food');
  } catch (error) {
    return false;
  }
}

// Verify authorization on mount
onMounted(async () => {
  // First check client-side (for local dev)
  if (!isAuthorized()) {
    // If client-side check fails, try API (for Vercel deployment)
    try {
      const response = await fetch('/api/check-auth', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        // Not authorized, redirect to password gate
        router.push('/private');
      }
    } catch (err) {
      // API not available (local dev) or error - redirect to password gate
      router.push('/private');
    }
  }
});

const goBack = () => {
  router.push('/private/index');
};
</script>

<template>
  <div class="p-6 space-y-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <button
        @click="goBack"
        class="text-gray-600 hover:text-gray-800 transition duration-300 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Private
      </button>
    </div>

    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Food & Places Guide</h1>
      <p class="text-lg text-gray-600">Restaurants and areas to visit in Mecca, Medina, and Jeddah</p>
    </div>

    <!-- Mecca Section -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🏛️ Mecca</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Food</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Areas to Visit</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
      </div>
    </section>

    <!-- Medina Section -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🕌 Medina</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Food</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Areas to Visit</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
      </div>
    </section>

    <!-- Jeddah Section -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🌊 Jeddah</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Food</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Areas to Visit</h3>
          <p class="text-gray-600">Content coming soon...</p>
        </div>
      </div>
    </section>
  </div>
</template>
