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
  year: number | string;
  genre: string[];
  imdb: string;
  imdbId: string;
  poster: string;
  category?: string | string[];
  director?: string;
  duration?: string;
  description?: string;
  country?: string;
  language?: string;
}

const filterByGenre = ref(true)

const sources = ['All', 'Fav', 'Doc', 'Anim', 'Comedy', 'Short', 'Series']

genresData.sort((a, b) => a.localeCompare(b));
const categories = computed(() => {
  if (filterByGenre.value) {
    return ['All', ...genresData];
  }
  return sources;
});

const selectedCategory = ref('All');

// Reset category when toggle changes
watch(filterByGenre, () => {
  selectedCategory.value = 'All'
})

// Modal state
const selectedMovie = ref<Movie | null>(null)
const isModalOpen = ref(false)

const openModal = (movie: Movie) => {
  selectedMovie.value = movie
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Process and combine movies
interface MovieWithId extends Movie {
  id: string;
  source: string;
}

const allMovies = computed(() => {
  const data: MovieWithId[] = [
    ...fav.map(m => ({ ...m as Movie, source: 'Fav' })),
    ...doc.map(m => ({ ...m as Movie, source: 'Doc' })),
    ...anim.map(m => ({ ...m as Movie, source: 'Anim' })),
    ...comedy.map(m => ({ ...m as Movie, source: 'Comedy' })),
    ...short.map(m => ({ ...m as Movie, source: 'Short' })),
    ...series.map(m => ({ ...m as Movie, source: 'Series' }))
  ].map((movie, index) => ({
    ...movie,
    id: movie.imdbId || `movie_${index}`,
    category: movie.genre || []
  })).sort((a, b) => a.title.localeCompare(b.title));
  
  // Remove duplicates by imdbId or title
  const seen = new Set();
  return data.filter(movie => {
    const key = movie.imdbId || movie.title;
    const isDuplicate = seen.has(key);
    seen.add(key);
    return !isDuplicate;
  });
})

const filteredMovies = computed(() => {
  let movies = allMovies.value;

  if (selectedCategory.value === 'All') {
    return movies;
  }

  if (filterByGenre.value) {
    return movies.filter(movie => 
      Array.isArray(movie.category) 
        ? movie.category.includes(selectedCategory.value)
        : movie.category === selectedCategory.value
    );
  } else {
    return movies.filter(movie => movie.source === selectedCategory.value);
  }
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <div class="filter-controls">
        <div class="switch-wrapper" @click="filterByGenre = !filterByGenre">
          <div class="switch-bg">
            <div class="switch-slider" :class="{ 'is-source': !filterByGenre }"></div>
          </div>
          <div class="switch-content">
            <span class="switch-label" :class="{ active: filterByGenre }">Genres</span>
            <span class="switch-label" :class="{ active: !filterByGenre }">Sources</span>
          </div>
        </div>
      </div>

      <CategoryFilter 
        :categories="categories" 
        v-model:selectedCategory="selectedCategory" 
      />

      <div v-if="filteredMovies.length > 0" class="movie-grid">
        <TransitionGroup name="fade">
          <div v-for="movie in filteredMovies" :key="movie.id" class="grid-item">
            <MovieCard :movie="movie" @show-details="openModal" />
          </div>
        </TransitionGroup>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🎬</div>
        <h2>No movies found</h2>
        <p>Try selecting a different category or wait for updates.</p>
        <button @click="selectedCategory = 'All'" class="reset-btn">View All Movies</button>
      </div>

      <!-- Movie Details Modal -->
      <MovieModal 
        :movie="selectedMovie" 
        :is-open="isModalOpen" 
        @close="closeModal" 
      />
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

.filter-controls {
  display: flex;
  /* justify-content: center; */
  margin-top: 1rem;
}

.switch-wrapper {
  position: relative;
  width: 9rem;
  height: 2rem;
  background: var(--card-bg);
  border-radius: 22px;
  padding: 4px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  user-select: none;
  display: flex;
  align-items: center;
}

.switch-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  pointer-events: none;
}

.switch-slider {
  width: 50%;
  height: 100%;
  background: var(--accent-color);
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
}

.switch-slider.is-source {
  transform: translateX(100%);
}

.switch-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}

.switch-label {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.switch-label.active {
  color: white;
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
