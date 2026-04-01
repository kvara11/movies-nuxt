<script setup lang="ts">
import guitarIcon from '~/assets/guitar.svg'
</script>

<template>
  <div class="app-container">
    <header class="main-header">
      <div class="container">
        <NuxtLink to="/" class="brand-link" aria-label="Go to home page">
          <h1>drk-star<span class="accent">-movies</span></h1>
        </NuxtLink>
        <NuxtLink to="/tabs" class="brand-link" aria-label="Go to home page">
          <img :src="guitarIcon" alt="" class="guitar-icon" aria-hidden="true" />
        </NuxtLink>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer class="main-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} drk-star. Built with Nuxt.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  padding: 1rem 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.guitar-icon {
  width: 1.2rem;
  height: 1.2rem;
  display: block;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
}

h1 {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.accent {
  color: var(--accent-color);
}

main {
  flex: 1;
}

.main-footer {
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 4rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
