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

    // Check if /umra is in the permissions array
    return parsed.permissions.includes('/umra');
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
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Umrah Quick Guide</h1>
      <p class="text-lg text-gray-600">A concise reference for your Umrah journey</p>
    </div>

    <!-- Absolute Must-Knows -->
    <section class="bg-amber-50 p-6 rounded-lg shadow-md border-l-4 border-amber-500">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">⚠️ Absolute Must-Knows</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li><strong>Order matters:</strong> Tawaf → 2 Rak‘ahs → Sa‘i → Hair.</li>
        <li><strong>Hateem</strong> must be walked around.</li>
        <li><strong>Sa‘i</strong> is 7 full units.</li>
      </ul>
    </section>

    <!-- Entering Masjid al-Haram -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🕋 Entering Masjid al-Haram (Before Tawaf)</h2>
      <div class="space-y-4 text-gray-700">
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Where to go:</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Enter through <strong>King Fahad Gate</strong> if possible.</li>
            <li>Remove your shoes and carry them.</li>
            <li>Head toward the <strong>mataf area</strong> (the open area around the Kaaba).</li>
          </ul>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
          <h3 class="font-semibold text-gray-800 mb-2">Important logistics note:</h3>
          <p>The mataf around the Kaaba is technically a basement level. Follow signs for <strong>Tawaf / Mataf</strong>. Ask cleaners or staff if unsure.</p>
        </div>
      </div>
    </section>

    <!-- First Sight of the Kaaba -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">👁️ First Sight of the Kaaba</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>Stop walking.</li>
        <li>Do not take selfies.</li>
        <li>Focus your heart.</li>
      </ul>
      <div class="bg-blue-50 p-4 rounded-md text-gray-700">
        <p><strong>Important to know:</strong> There is no authentic specific du‘a from the Prophet ﷺ for the first sight. You may make any sincere personal du‘a.</p>
      </div>
    </section>

    <!-- Preparing for Tawaf (Men) -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">👔 Preparing for Tawaf (Men)</h2>
      <div class="space-y-4 text-gray-700">
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Idtiba (Uncover Right Shoulder):</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Pass the top Ihram cloth under your right armpit.</li>
            <li>Leave the right shoulder uncovered.</li>
          </ul>
        </div>
        <p class="text-gray-600 italic"><strong>Sunnah (not obligatory):</strong> Only during Tawaf. Cover your shoulder again after Tawaf.</p>
      </div>
    </section>

    <!-- Starting Tawaf (7 Circles) -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🔄 Starting Tawaf (7 Circles)</h2>
      <div class="space-y-4 text-gray-700">
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Where to start:</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Begin at the <strong>Black Stone (Hajar al-Aswad)</strong>.</li>
            <li>Face it and say <em>"Allahu Akbar"</em>.</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">How to walk:</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>Kaaba on your left.</li>
            <li>Walk anti-clockwise.</li>
            <li>Complete 7 full circles.</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Raml (Men Only):</h3>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li><strong>First 3 rounds:</strong> brisk walk / light jog.</li>
            <li><strong>Last 4 rounds:</strong> normal walk.</li>
          </ul>
          <p class="mt-2 text-gray-600 italic"><strong>Sunnah:</strong> Raml is Sunnah for men only. Skip if unsafe due to crowds.</p>
        </div>
      </div>
    </section>

    <!-- During Tawaf – Critical Notes -->
    <section class="bg-red-50 p-6 rounded-lg shadow-md border-l-4 border-red-400">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">⛔ During Tawaf – Critical Notes</h2>
      <div class="space-y-4 text-gray-700">
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Corners of the Kaaba:</h3>
          <p>Do <strong>not</strong> touch <strong>Shami</strong> or <strong>Iraqi</strong> corners. Only touch or gesture to the <strong>Black Stone</strong> and <strong>Yemeni corner</strong>.</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Hateem (Semi-circular wall):</h3>
          <p><strong>Hateem is part of the Kaaba.</strong> Walk around it, not through it.</p>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-2">Du‘a during Tawaf:</h3>
          <p>No fixed du‘as required. Silent Qur’an recitation, personal du‘a, and dhikr are recommended.</p>
        </div>
        <p class="font-semibold text-gray-800">Important Sunnah: Do not hurt anyone. Avoid pushing, shoving, arguing.</p>
      </div>
    </section>

    <!-- Multazam -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🤲 Multazam (Optional but Powerful)</h2>
      <p class="text-gray-700">Area between Black Stone and Kaaba door. If accessible, press chest, face, arms against the Kaaba and make intense personal du‘a. <strong>Skip if overcrowded.</strong></p>
    </section>

    <!-- Completing Tawaf -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">✅ Completing Tawaf</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li><strong>After 7th round:</strong> Cover your right shoulder again. Move away from the mataf.</li>
        <li><strong>Two Rak‘ahs:</strong> Pray 2 rak‘ahs. Best place: behind <strong>Maqam Ibrahim</strong>. If crowded, pray anywhere in the masjid. <em>Sunnah Mu’akkadah.</em></li>
        <li><strong>Zamzam:</strong> Drink Zamzam and make du‘a while drinking.</li>
      </ul>
    </section>

    <!-- Going to Sa'i -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🚶 Going to Sa‘i (Safa ↔ Marwah)</h2>
      <div class="space-y-4 text-gray-700">
        <h3 class="font-semibold text-gray-800">Best route & floor:</h3>
        <ul class="list-disc list-inside space-y-1 ml-2">
          <li>Follow signs for <strong>Sa‘i</strong>.</li>
          <li><strong>First floor is recommended:</strong> less crowded, more peaceful.</li>
          <li>Avoid ground floor if possible.</li>
          <li>Ask cleaners for directions if needed.</li>
        </ul>
      </div>
    </section>

    <!-- Starting Sa'i -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🏁 Starting Sa‘i</h2>
      <p class="text-gray-700 mb-2"><strong>At Safa:</strong></p>
      <ul class="list-disc list-inside text-gray-700 space-y-2 ml-2">
        <li>Face the Kaaba.</li>
        <li>Say <em>"Allahu Akbar"</em> and begin du‘a.</li>
        <li>No fixed wording required; speak from the heart.</li>
      </ul>
    </section>

    <!-- Performing Sa'i (7 Units) -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🔄 Performing Sa‘i (7 Units)</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li><strong>Safa → Marwah</strong> = 1 unit.</li>
        <li><strong>Marwah → Safa</strong> = 2 units.</li>
        <li><strong>Total = 7 units.</strong> Start at Safa, end at Marwah.</li>
        <li><strong>Green lights:</strong> Jog lightly between green markers (men only). Walk normally elsewhere.</li>
      </ul>
    </section>

    <!-- Du'a Structure -->
    <section class="bg-blue-50 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🤲 Du‘a Structure (Helpful Tip)</h2>
      <p class="text-gray-700">Prepare du‘a themes: forgiveness, family, worldly needs, Akhirah, guidance, gratitude. Helps maintain focus.</p>
    </section>

    <!-- Ending Umrah – Hair -->
    <section class="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">✂️ Ending Umrah – Hair</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Shave your head (best) or trim hair evenly.</li>
        <li><strong>Umrah is complete.</strong></li>
        <li>Ihram restrictions are lifted.</li>
      </ul>
    </section>
  </div>
</template>
