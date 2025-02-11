<script lang="ts" setup>
import { ref } from 'vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <div
        class="flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out"
        :class="{ 'w-48': isSidebarOpen, 'w-12': !isSidebarOpen }"
        @mouseleave="closeSidebar"
    >
      <div
          class="p-4 flex justify-center items-center cursor-pointer hover:bg-gray-700 transition duration-300"
          @click="toggleSidebar"
      >
        <div class="space-y-1.5">
          <div class="w-6 h-0.5 bg-white"></div>
          <div class="w-6 h-0.5 bg-white"></div>
          <div class="w-6 h-0.5 bg-white"></div>
        </div>
      </div>

      <nav
          v-if="isSidebarOpen"
          class="flex flex-col gap-4 p-4"
      >
        <router-link
            to="/"
            class="py-2 px-4 rounded-md transition duration-300"
            active-class="bg-gray-700 text-white"
            :class="{ 'hover:bg-gray-500': $route.path !== '/' }"
        >
          Home
        </router-link>
        <router-link
            to="/about"
            class="py-2 px-4 rounded-md transition duration-300"
            active-class="bg-gray-700 text-white"
            :class="{ 'hover:bg-gray-500': $route.path !== '/about' }"
        >
          About
        </router-link>
      </nav>
    </div>

    <main class="flex-1 p-6 transition-all duration-300 ease-in-out">
      <router-view></router-view>
    </main>
  </div>
</template>
