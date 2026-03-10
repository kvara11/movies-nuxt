<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

interface Movie {
  title: string;
  year: number | string;
  genre: string[];
  director: string;
  duration: string;
  description: string;
  country: string;
  imdb: string;
  imdbId: string;
  language: string;
  poster: string;
}

const props = defineProps<{
  movie: Movie | null;
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>


<template>
  <Transition name="modal">
    <div v-if="isOpen && movie" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <button class="close-btn" @click="close" aria-label="Close modal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-content">
          <div class="poster-section">
            <img :src="movie.poster" :alt="movie.title" />
          </div>

          <div class="info-section">
            <h2 class="title">{{ movie.title }}</h2>
            <div class="meta-row">
              <span class="year">{{ movie.year }}</span>
              <span class="dot">•</span>
              <span class="duration">{{ movie.duration }}</span>
              <span class="dot">•</span>
              <span class="language">{{ movie.language }}</span>
            </div>

            <div class="genre-tags">
              <span v-for="g in movie.genre" :key="g" class="genre-tag">{{
                g
              }}</span>
            </div>

            <div class="description">
              <p>{{ movie.description }}</p>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Director</span>
                <span class="value">{{ movie.director }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Country</span>
                <span class="value">{{ movie.country }}</span>
              </div>
              <!-- <div class="detail-item">
                <span class="label">IMDb ID</span>
                <span class="value">{{ movie.imdbId }}</span>
              </div> -->
            </div>

            <div class="imdb-section">
              <div>
                <a
                  :href="`https://www.imdb.com/title/${movie.imdbId}`"
                  target="_blank"
                  class="imdb-link"
                >
                  View on IMDb
                </a>
              </div>

              <div v-if="movie.imdb !== 'N/A'" class="rating">
                ⭐ {{ movie.imdb }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: #1e293b;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 1.5rem;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.imdb-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  min-height: 500px;
}

.poster-section {
  position: sticky;
  top: 0;
  align-self: start;
  background: #0f172a;
  height: auto;
  max-height: 100%;
  overflow: hidden;
}

.poster-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rating {
  background: rgba(15, 23, 42, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 700;
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.info-section {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: white;
  margin: 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.dot {
  color: #475569;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.description {
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 1.05rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 700;
}

.value {
  color: #e2e8f0;
  font-weight: 500;
}

.actions {
  margin-top: 1rem;
}

.imdb-link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #f5c518;
  color: black;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.imdb-link:hover {
  background: #e2b616;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 197, 24, 0.3);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal-container {
  transition: all 0.2s ease-in;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .poster-section {
    aspect-ratio: 16/9;
  }

  .info-section {
    padding: 2rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
