<template>
  <div class="app-container">
    <header class="main-header">
      <div class="container">
        <h1>Movie<span class="accent">App</span></h1>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer class="main-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Movie Catalog. Built with Nuxt.</p>
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

h1 {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
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
