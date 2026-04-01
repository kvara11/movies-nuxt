<script setup lang="ts">

interface PdfItem {
  title: string;
  src: string;
}

interface PdfViewerConfig {
  toolbar: 0 | 1;
  navpanes: 0 | 1;
  scrollbar: 0 | 1;
  statusbar: 0 | 1;
  messages: 0 | 1;
}

const pdfModules = import.meta.glob('~/data/tabs/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>

const pdfItems: PdfItem[] = Object.entries(pdfModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop() || path
    const title = decodeURIComponent(fileName.replace(/\.pdf$/i, ''))
    return { title, src }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

const selectedPdf = ref<PdfItem | null>(null)
const isViewerMaximized = ref(false)

// Change these flags to hide/show built-in PDF viewer UI parts.
const viewerConfig = reactive<PdfViewerConfig>({
  toolbar: 0,
  navpanes: 0,
  scrollbar: 1,
  statusbar: 0,
  messages: 0
})

const viewerSrc = computed(() => {
  if (!selectedPdf.value) {
    return ''
  }

  const params = new URLSearchParams()
  params.set('toolbar', String(viewerConfig.toolbar))
  params.set('navpanes', String(viewerConfig.navpanes))
  params.set('scrollbar', String(viewerConfig.scrollbar))
  params.set('statusbar', String(viewerConfig.statusbar))
  params.set('messages', String(viewerConfig.messages))

  return `${selectedPdf.value.src}#${params.toString()}`
})

const selectPdf = (item: PdfItem) => {
  selectedPdf.value = item
  isViewerMaximized.value = false
}

const toggleViewerSize = () => {
  isViewerMaximized.value = !isViewerMaximized.value
}
</script>

<template>
  <section class="tabs-page">
    <div class="container">
      <div v-if="pdfItems.length" class="pdf-grid">
        <button
          v-for="item in pdfItems"
          :key="item.src"
          type="button"
          class="pdf-card"
          :class="{ active: selectedPdf?.src === item.src }"
          @click="selectPdf(item)"
        >
          <span class="pdf-title">{{ item.title.slice(0, 20) }}</span>
        </button>
      </div>

      <p v-else class="empty-state">No PDF found.</p>

      <div v-if="selectedPdf" class="viewer-wrap" :class="{ maximized: isViewerMaximized }">
        <div class="viewer-header">
          <p class="viewer-title">{{ selectedPdf.title }}</p>
          <button type="button" class="viewer-toggle" @click="toggleViewerSize">
            {{ isViewerMaximized ? 'Exit' : 'Maximize' }}
          </button>
        </div>
        <iframe
          :src="viewerSrc"
          class="pdf-viewer"
          title="PDF viewer"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tabs-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pdf-grid {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.pdf-card {
  min-width: 120px;
  min-height: 56px;
  border: 1px solid rgba(97, 97, 97, 0.15);
  background: rgba(68, 68, 68, 0.842);
  color: var(--text-primary);
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  text-align: left;
}

.pdf-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

.pdf-card.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.pdf-title {
  display: block;
  font-size: 0.8rem;
  line-height: 1.2;
  word-break: break-word;
  text-align: center;
}

.empty-state {
  color: var(--text-secondary);
}

.viewer-wrap {
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.viewer-wrap.maximized {
  position: fixed;
  inset: 1rem;
  z-index: 200;
  margin: 0;
}

.viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.viewer-title {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.viewer-toggle {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
}

.viewer-toggle:hover {
  border-color: var(--accent-color);
}

.pdf-viewer {
  width: 100%;
  min-height: 72vh;
  border: 0;
  border-radius: 0.5rem;
  background: #fff;
}

.viewer-wrap.maximized .pdf-viewer {
  min-height: calc(100vh - 5.5rem);
}
</style>
