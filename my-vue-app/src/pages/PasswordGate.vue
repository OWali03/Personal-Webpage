<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const password = ref('');
const error = ref('');
const isLoading = ref(false);

// Hardcoded password to route mappings (client-side for local dev)
// Each password grants access to an array of routes
// TODO: When deploying to Vercel, this will use the API routes instead
const PASSWORD_ROUTES: Record<string, string[]> = {
  'owali': ['/umra', '/dua', '/food'], // Master password - grants access to all routes
  'owali.umra': ['/umra', '/dua'], // Grants access to Umra guide and Dua verses
  // Future mappings:
};

// Session storage key
const SESSION_STORAGE_KEY = 'auth_permissions';

// Check for existing valid session on mount
onMounted(() => {
  // Check if user already has valid session authorization
  try {
    const authData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.permissions && Array.isArray(parsed.permissions) && parsed.permissions.length > 0) {
        // Valid session exists, redirect to private index
        router.push('/private/index');
      }
    }
  } catch (err) {
    // Invalid session data, continue to password entry
    console.log('No valid session found');
  }
});

const goBack = () => {
  // Go back to previous page, or home if no history
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

// Logout helper - clears session and redirects to password gate
// (Also available in PrivateIndex.vue)
const clearSession = () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  router.push('/private');
};

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;

  // Simulate a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Check if password matches any route permissions
    const permissions = PASSWORD_ROUTES[password.value];

    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      error.value = 'Invalid password. Please try again.';
      password.value = '';
      isLoading.value = false;
      return;
    }

    // Store authorized permissions in sessionStorage
    // Format: { permissions: string[] }
    const authData = {
      permissions: permissions,
    };

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authData));

    // Redirect to private index page (not a specific protected route)
    router.push('/private/index');
  } catch (err) {
    error.value = 'An error occurred. Please try again.';
    console.error('Password verification error:', err);
    password.value = '';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
    <!-- Back button in top left corner -->
    <button
      @click="goBack"
      class="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition duration-300 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>

    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Private Access
      </h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Enter Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            placeholder="Password"
            required
            autofocus
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Verifying...</span>
          <span v-else>Access</span>
        </button>
      </form>
    </div>
  </div>
</template>
