<script setup lang="ts">
interface Movie {
  title: string;
  year: number;
  genre: string[];
  imdb: string;
  imdbId: string;
  poster: string;
}

const emit = defineEmits(["show-details"]);

defineProps<{
  movie: Movie;
}>();
</script>

<template>
  <div class="movie-card" @click="emit('show-details', movie)">
    <div class="poster-container">
      <img :src="movie.poster" :alt="movie.title" loading="lazy" />
      <div v-if="movie.imdb && movie.imdb !== 'N/A'" class="rating-badge">
        <span>⭐ {{ movie.imdb }}</span>
      </div>
    </div>
    <div class="movie-info">
      <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
      <div class="meta">
        <span class="year">{{ movie.year }}</span>
        <span class="dot">•</span>
        <span class="genres">{{ movie.genre.join(", ") }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #334155;
}

.poster-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster-container img {
  transform: scale(1.05);
}

.rating-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  padding: 0.375rem 0.625rem;
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--star-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.movie-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.dot {
  opacity: 0.5;
}

.genres {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
