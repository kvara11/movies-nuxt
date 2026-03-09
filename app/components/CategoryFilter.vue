<script setup lang="ts">
const props = defineProps<{
  categories: string[];
  selectedCategory: string;
}>();

defineEmits<{
  (e: 'update:selectedCategory', category: string): void;
}>();
</script>

<template>
  <div class="category-filter">
    <div class="scroll-container">
      <button
        v-for="category in categories"
        :key="category"
        class="category-btn"
        :class="{ active: selectedCategory === category }"
        @click="$emit('update:selectedCategory', category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  margin: 2rem 0;
  position: sticky;
  top: 5.5rem; /* Header height offset */
  z-index: 90;
  background: var(--bg-color);
  padding: 1rem 0;
}

.scroll-container {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.25rem 0.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.scroll-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.category-btn {
  white-space: nowrap;
  padding: 0.625rem 1.25rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: #334155;
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.category-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}
</style>
