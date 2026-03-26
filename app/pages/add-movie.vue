<script setup lang="ts">
interface AddMovieForm {
  secret: string
  title: string
  year: string
  genre: string
  imdb: string
  imdbId: string
  poster: string
  director: string
  duration: string
  description: string
  country: string
  language: string
}

const form = reactive<AddMovieForm>({
  secret: '',
  title: '',
  year: '',
  genre: '',
  imdb: '',
  imdbId: '',
  poster: '',
  director: '',
  duration: '',
  description: '',
  country: '',
  language: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const resetMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const submitMovie = async () => {
  resetMessages()

  if (!form.title.trim()) {
    errorMessage.value = 'Title is required.'
    return
  }

  if (!form.secret.trim()) {
    errorMessage.value = 'Secret is required.'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/movies/add', {
      method: 'POST',
      body: {
        ...form,
        genre: form.genre
      }
    })

    successMessage.value = 'Movie added to Fav list.'
    Object.assign(form, {
      ...form,
      title: '',
      year: '',
      genre: '',
      imdb: '',
      imdbId: '',
      poster: '',
      director: '',
      duration: '',
      description: '',
      country: '',
      language: ''
    })
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Failed to add movie.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="add-movie-page">
    <div class="container">
      <h1>Add Movie</h1>
      <p class="hint">Minimal protected form. Secret is checked only on server.</p>

      <form class="form" @submit.prevent="submitMovie">
        <input v-model="form.secret" type="password" placeholder="Secret" required />
        <input v-model="form.title" type="text" placeholder="Title" required />
        <input v-model="form.year" type="text" placeholder="Year (e.g. 1999)" />
        <input v-model="form.genre" type="text" placeholder="Genres (comma-separated)" />
        <input v-model="form.imdb" type="text" placeholder="IMDb rating" />
        <input v-model="form.imdbId" type="text" placeholder="IMDb ID (tt1234567)" />
        <input v-model="form.poster" type="url" placeholder="Poster URL" />
        <input v-model="form.director" type="text" placeholder="Director" />
        <input v-model="form.duration" type="text" placeholder="Duration (e.g. 94 min)" />
        <input v-model="form.country" type="text" placeholder="Country" />
        <input v-model="form.language" type="text" placeholder="Language" />
        <textarea v-model="form.description" rows="4" placeholder="Description"></textarea>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Adding...' : 'Add Movie' }}
        </button>

        <p v-if="successMessage" class="status success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-movie-page {
  padding: 2rem 0 4rem;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

h1 {
  margin-bottom: 0.5rem;
}

.hint {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.form {
  display: grid;
  gap: 0.75rem;
}

input,
textarea,
button {
  border-radius: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0.65rem 0.8rem;
  font: inherit;
}

textarea {
  resize: vertical;
}

button {
  cursor: pointer;
  font-weight: 600;
  background: var(--accent-color);
  border-color: transparent;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-size: 0.95rem;
}

.success {
  color: var(--accent-color);
}

.error {
  color: var(--text-primary);
}
</style>
