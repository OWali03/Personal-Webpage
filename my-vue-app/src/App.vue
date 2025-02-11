<script lang="ts" setup>
</script>


<template>
  <div>
    <nav class="bg-gray-800 p-4 text-white flex gap-4">
      <router-link to="/" class="hover:text-blue-400">Home</router-link>
      <router-link to="/about" class="hover:text-blue-400">About</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
