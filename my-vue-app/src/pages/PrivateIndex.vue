<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const SESSION_STORAGE_KEY = 'auth_permissions';
const allowedRoutes = ref<string[]>([]);

// Route display names mapping
const routeNames: Record<string, string> = {
  '/umra': 'Umrah Guide',
  '/dua': 'Dua Verses',
  '/food': 'Food & Places (Mecca/Medina/Jeddah)',
};

// Logout helper
const logout = () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  router.push('/private');
};

onMounted(() => {
  // Load permissions from session
  try {
    const authData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.permissions && Array.isArray(parsed.permissions)) {
        allowedRoutes.value = parsed.permissions;
      } else {
        // No valid permissions, redirect to password gate
        router.push('/private');
      }
    } else {
      // No session, redirect to password gate
      router.push('/private');
    }
  } catch (err) {
    // Invalid session, redirect to password gate
    router.push('/private');
  }
});
</script>

<template>
  <div class="p-6 space-y-8 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Private Section</h1>
        <p class="text-lg text-gray-600">Select a page to access</p>
      </div>
      <button
        @click="logout"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
      >
        Logout
      </button>
    </div>

    <div v-if="allowedRoutes.length === 0" class="text-center py-12">
      <p class="text-gray-600">No authorized routes available.</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="route in allowedRoutes"
        :key="route"
        :to="route"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-2 border-transparent hover:border-gray-800"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ routeNames[route] || route }}
        </h2>
        <p class="text-gray-600 text-sm">Click to access</p>
      </router-link>
    </div>
  </div>
</template>
