<script setup lang="ts">
const props = defineProps<{
  categories: string[];
  selectedCategory: string;
}>();

defineEmits<{
  (e: 'update:selectedCategory', category: string): void;
}>();

const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div class="category-filter-wrapper">
    <button class="arrow-btn" @click="scroll('left')" aria-label="Scroll left">&lt;</button>
    <div class="category-filter" ref="scrollContainer">
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
    <button class="arrow-btn" @click="scroll('right')" aria-label="Scroll right">&gt;</button>
  </div>
</template>

<style scoped>
.category-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0 2rem;
  position: sticky;
  top: 5.5rem; /* Header height offset */
  z-index: 90;
  background: var(--bg-color);
  padding: 1rem 0;
}

.category-filter {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  scroll-behavior: smooth;
}

.category-filter::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.scroll-container {
  display: flex;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.arrow-btn {
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.arrow-btn:hover {
  background: #334155;
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
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
