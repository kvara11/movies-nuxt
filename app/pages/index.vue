<script setup lang="ts">
import anim from '~/data/anim.json'
import comedy from '~/data/comedy.json'
import doc from '~/data/doc.json'
import fav from '~/data/fav.json'
import series from '~/data/series.json'
import short from '~/data/short.json'
import genresData from '~/data/genres.json'
import randomIcon from '~/assets/random.svg'

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
const searchQuery = ref('')
const randomMovies = ref<MovieWithId[] | null>(null)
const filterControlsRef = ref<HTMLElement | null>(null)

// Reset category when toggle changes
watch(filterByGenre, () => {
  selectedCategory.value = 'All'
})

watch(selectedCategory, async (newCategory, oldCategory) => {
  if (!filterByGenre.value || newCategory === 'All' || newCategory === oldCategory) {
    return
  }

  await nextTick()
  filterControlsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

interface YearRange {
  start: number | null;
  end: number | null;
}

const CURRENT_YEAR = new Date().getFullYear()

const getMovieYearRange = (yearValue: Movie['year']): YearRange | null => {
  const raw = String(yearValue ?? '').trim()
  if (!raw) {
    return null
  }

  const matches = raw.match(/\d{4}/g)
  if (!matches?.length) {
    return null
  }

  const start = Number.parseInt(matches[0], 10)
  const hasRangeSeparator = /[-–—]/.test(raw)
  const end = matches[1] ? Number.parseInt(matches[1], 10) : (hasRangeSeparator ? null : start)

  return { start, end }
}

const extractDateFilter = (rawQuery: string) => {
  const dateTokenRegex = /(?:^|\s)(?:year|year):(\d{4})?(?:\s*[-–—]\s*(\d{4})?)?(?=\s|$)/i
  const match = rawQuery.match(dateTokenRegex)

  if (!match) {
    return {
      textQuery: rawQuery.trim().toLowerCase(),
      yearRange: null as YearRange | null
    }
  }

  const start = match[1] ? Number.parseInt(match[1], 10) : null
  const end = match[2] ? Number.parseInt(match[2], 10) : null
  const yearRange = start === null && end === null ? null : { start, end }

  return {
    textQuery: rawQuery.replace(match[0], ' ').trim().toLowerCase(),
    yearRange
  }
}

const isMovieInRange = (movieYear: Movie['year'], queryRange: YearRange) => {
  const movieRange = getMovieYearRange(movieYear)
  if (!movieRange?.start) {
    return false
  }

  const queryStart = queryRange.start ?? 0
  const queryEnd = queryRange.end ?? CURRENT_YEAR
  const movieStart = movieRange.start
  const movieEnd = movieRange.end ?? CURRENT_YEAR

  return movieStart <= queryEnd && movieEnd >= queryStart
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

  if (selectedCategory.value !== 'All') {
    if (filterByGenre.value) {
      movies = movies.filter(movie =>
        Array.isArray(movie.category)
          ? movie.category.includes(selectedCategory.value)
          : movie.category === selectedCategory.value
      );
    } else {
      movies = movies.filter(movie => movie.source === selectedCategory.value);
    }
  }

  const { textQuery, yearRange } = extractDateFilter(searchQuery.value)

  if (yearRange) {
    movies = movies.filter(movie => isMovieInRange(movie.year, yearRange))
  }

  if (!textQuery) {
    return movies
  }

  return movies.filter(movie => {
    const searchableFields = [
      movie.title,
      movie.year,
      movie.country,
      movie.director,
      movie.description,
      ...(movie.genre || [])
    ]

    return searchableFields.some(field =>
      String(field || '').toLowerCase().includes(textQuery)
    )
  })
})

const pickRandomMovies = () => {
  const pool = [...filteredMovies.value]
  if (!pool.length) {
    randomMovies.value = null
    return
  }

  randomMovies.value = pool
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
}

const clearRandomMovies = () => {
  randomMovies.value = null
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const displayedMovies = computed(() => randomMovies.value ?? filteredMovies.value)
const isRandomMode = computed(() => randomMovies.value !== null)

watch([selectedCategory, searchQuery, filterByGenre], () => {
  randomMovies.value = null
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <div ref="filterControlsRef" class="filter-controls">
        <div class="switch-wrapper" @click="filterByGenre = !filterByGenre">
          <div class="switch-bg">
            <div class="switch-slider" :class="{ 'is-source': !filterByGenre }"></div>
          </div>

          <div class="switch-content">
            <span class="switch-label" :class="{ active: filterByGenre }">Genres</span>
            <span class="switch-label" :class="{ active: !filterByGenre }">Sources</span>
          </div>
        </div>

        <div class="right-filters">
          <div class="search-wrapper">
            <input
              v-model="searchQuery"
              type="search"
              class="search-input"
              placeholder="Search movies..."
              aria-label="Search movies"
            />
          </div>

          <div class="random-btn-wrap">
            <button class="random-btn" type="button" aria-label="Pick 4 random movies" @click="pickRandomMovies">
              <img :src="randomIcon" alt="" class="random-icon" aria-hidden="true" />
            </button>

            <button
              v-if="isRandomMode"
              class="clear-random-btn"
              type="button"
              aria-label="Show all movies"
              @click="clearRandomMovies"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <CategoryFilter :categories="categories" v-model:selectedCategory="selectedCategory" />

      <div v-if="displayedMovies.length > 0" class="movie-grid">
        <TransitionGroup name="fade">
          <div v-for="movie in displayedMovies" :key="movie.id" class="grid-item">
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
      <MovieModal :movie="selectedMovie" :is-open="isModalOpen" @close="closeModal" />

      <button class="scroll-top-btn" type="button" aria-label="Scroll to top" @click="scrollToTop">
        ↑
      </button>
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
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.right-filters {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-wrapper {
  width: min(320px, 100%);
}

.search-input {
  width: 100%;
  height: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0 0.85rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-input:focus {
  border-color: var(--accent-color);
}

.random-btn {
  height: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.random-btn:hover {
  border-color: var(--accent-color);
}

.random-btn-wrap {
  position: relative;
  display: inline-flex;
}

.clear-random-btn {
  position: absolute;
  top: -0.35rem;
  right: -0.35rem;
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: var(--card-bg);
  color: #ff0e0e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

.clear-random-btn:hover {
  color: var(--text-primary);
  border-color: var(--accent-color);
}

.random-icon {
  width: 1rem;
  height: 1rem;
  display: block;
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

.scroll-top-btn {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
}

.scroll-top-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .switch-wrapper {
    width: 100%;
    max-width: 12rem;
  }

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
