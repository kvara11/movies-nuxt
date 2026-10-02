<script setup lang="ts">
// Pages set their own `title` via useHead; home falls back to the site name
useHead({
  titleTemplate: (title) => (title ? `${title} · drk-star-movies` : 'drk-star-movies'),
  htmlAttrs: { lang: 'en' }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
