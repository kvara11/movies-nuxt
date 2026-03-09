<script setup lang="ts">
import anim from '~/data/anim.json'
import comedy from '~/data/comedy.json'
import doc from '~/data/doc.json'
import fav from '~/data/fav.json'
import series from '~/data/series.json'
import short from '~/data/short.json'
import genresData from '~/data/genres.json'

interface Movie {
  title: string;
  year: number;
  genre: string[];
  imdb: string;
  imdbId: string;
  poster: string;
  category: string;
}

const categories = ['All', ...genresData]
const selectedCategory = ref('All')

// Process and combine movies
const allMovies = computed(() => {
  const data = [...fav, ...doc, ...anim, ...comedy, ...short, ...series]
    .map((movie, index) => ({
      ...movie,
      id: movie.imdbId || `movie_${index}`,
      category: movie.genre || []
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  
  // Remove duplicates by imdbId or title
  const seen = new Set();
  return data.filter(movie => {
    const duplicate = seen.has(movie.imdbId || movie.title);
    seen.add(movie.imdbId || movie.title);
    return !duplicate;
  });
})

const filteredMovies = computed(() => {
  if (selectedCategory.value === 'All') {
    return allMovies.value;
  }
  return allMovies.value.filter(movie => 
    Array.isArray(movie.category) 
      ? movie.category.includes(selectedCategory.value)
      : movie.category === selectedCategory.value
  );
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <CategoryFilter 
        :categories="categories" 
        v-model:selectedCategory="selectedCategory" 
      />

      <div v-if="filteredMovies.length > 0" class="movie-grid">
        <TransitionGroup name="fade">
          <div v-for="movie in filteredMovies" :key="movie.imdbId || movie.title" class="grid-item">
            <MovieCard :movie="movie" />
          </div>
        </TransitionGroup>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🎬</div>
        <h2>No movies found</h2>
        <p>Try selecting a different category or wait for updates.</p>
        <button @click="selectedCategory = 'All'" class="reset-btn">View All Movies</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: var(--card-bg);
  border-radius: 1.5rem;
  margin-top: 2rem;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.reset-btn:hover {
  background: var(--accent-hover);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: 1fr;
  }
}
</style>
