# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # also runs `nuxt prepare` (postinstall) to generate .nuxt/ types
npm run dev        # dev server on http://localhost:3000
npm run build      # production build into .output/
npm run generate   # static prerender
npm run preview    # serve the production build locally
```

There is no test suite, linter, or formatter configured. Type checking runs through the tsconfigs generated in `.nuxt/`, so run `npm run dev` or `nuxt prepare` first if types are missing.

## Architecture

This is a Nuxt 4 app (`compatibilityVersion: 4`, so source lives under `app/`). It is a personal movie catalogue plus a guitar-tab PDF viewer. There is no database and no backend: all content is static files that are bundled at build time.

### Movie data (`app/data/movies/`)

- Movies are split across source lists: `fav.json`, `doc.json`, `anim.json`, `comedy.json`, `short.json`, `series.json`. Each file is a JSON array of objects shaped like OMDb output: `id`, `title`, `year`, `genre` (string array), `director`, `duration`, `poster` (URL), `description`, `imdb` (rating string), `imdbId`, `language`, `country`.
- `increment.json` (`{ "id": N }`) holds the last assigned `id`. When you add a movie, give it `id = N + 1` and write the new value back to `increment.json`. Most commits in this repo do exactly that.
- `genres.json` is the list that drives the genre filter chips. Any new genre on a movie must be added here too, or it cannot be filtered on.
- `year` is a string and can be a range for series (e.g. `"2015–2019"`, which uses an en dash). Many fields use `"N/A"` where OMDb had no value.
- `import.json` and `errors.json` are empty leftovers from an OMDb import script (`api.js`, removed in commit `ed865aa`).

### Home page (`app/pages/index.vue`)

All filtering is client-side over data imported statically from the JSON files.

- It imports all six lists and tags each movie with a `source` (`Fav`, `Doc`, …). It then dedupes by `imdbId || title`: the first occurrence wins, in the order fav → doc → anim → comedy → short → series.
- By default the list is sorted by title. The "desc" toggle sorts by `id` descending instead, which shows the most recently added movies first.
- A toggle switches the category chips between genres (from `genres.json`) and sources.
- The search box matches title, year, country, director and genres. It also accepts a `year:YYYY`, `year:YYYY-YYYY` or open-ended `year:YYYY-` token. That token is parsed out of the query and matched by range overlap against the movie's year range.
- The random button picks 4 movies from the current filtered set.

Components in `app/components/` are auto-imported: `MovieCard` emits `show-details`, `MovieModal` takes `movie` and `isOpen` and emits `close`, and `CategoryFilter` uses `v-model:selectedCategory`.

### Tabs page (`app/pages/tabs.vue`)

It lists every PDF in `app/data/tabs/` via `import.meta.glob(..., { query: '?url', eager: true })`, using the file name as the title (several are in Georgian). Adding a PDF to that folder is all it takes to add a tab. PDFs render in the browser's built-in viewer, and `viewerConfig` sets the URL fragment flags that hide or show the viewer's UI. `pdfjs-dist` is installed but not currently used.

### Add-movie page (`app/pages/add-movie.vue`)

It POSTs to `/api/movies/add` with a `secret` field, but `server/` is empty, so this endpoint does not exist and the page is currently non-functional. New movies are added by editing the JSON files directly.

### Styling

Global CSS variables (`--accent-color`, `--card-bg`, `--text-primary`, `--text-secondary`, …) are defined in `app/assets/css/main.css`. Components use scoped styles that reference these variables. The design is dark-theme only.

## Notes

- `INSTRUCTIONS.MD` is not instructions. It holds the React Native source (HomeScreen, MovieCard, YearPicker) that this app was ported from, kept for reference.
- `README.md` is the unmodified Nuxt starter README.
