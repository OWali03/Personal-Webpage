<script lang="ts" setup>
</script>

<template>
  <div class="p-6 space-y-12 max-w-4xl mx-auto">
    <!-- Hero Section -->
    <section class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Welcome to Omar's Webpage</h1>
      <p class="text-lg text-gray-600">A place to showcase my skills, experience, and more.</p>
    </section>

    <!-- About Me Section -->
    <section class="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
      <p class="text-gray-700">
        I'm Omar, a passionate developer exploring the world of web technologies.
        This webpage is a personal space where I showcase my work, share ideas,
        and connect with like-minded individuals.
      </p>
    </section>

    <!-- Resume Section -->
    <section>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">My Resume</h2>
      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
        <p class="text-gray-700 mb-4">
          Here’s a quick overview of my skills and experience. You can also download my full resume below.
        </p>

        <!-- Resume Highlights -->
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>🌐 Strong background in web development (Vue.js, TypeScript, Node.js, Spring, Java)</li>
          <li>💼 Experience in building responsive and dynamic user interfaces</li>
          <li>🚀 Passionate about continuous learning and improving coding practices</li>
          <li>🔧 Skilled in REST APIs, databases, and deployment</li>
        </ul>

        <!-- Download Resume Button -->
        <a
            href="/Omar_Wali_Resume.pdf"
            download
            class="mt-6 inline-block bg-gray-800 text-white px-6 py-3 rounded-md shadow hover:bg-gray-700 transition transform hover:scale-105"
        >
          📥 Download My Resume
        </a>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">Contact Me</h2>
      <ul class="space-y-2">
        <li>
          📧 Email:
          <a href="mailto:omarwali030303@gmail.com" class="text-blue-400 hover:underline hover:text-blue-300 transition">
            omarwali030303@gmail.com
          </a>
        </li>
        <li>
          🐱 GitHub:
          <a href="https://github.com/OWali03" target="_blank" class="text-blue-400 hover:underline hover:text-blue-300 transition">
            github.com/OWali03
          </a>
        </li>
        <li>
          🔗 LinkedIn:
          <a href="https://www.linkedin.com/in/omar-wali-6aa797212" target="_blank" class="text-blue-400 hover:underline hover:text-blue-300 transition">
            linkedin.com/in/omar-wali-6aa797212
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
