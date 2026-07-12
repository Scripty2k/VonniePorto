<template>
  <div class="detail-container">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p class="mystical-text">Consulting the cards...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <router-link to="/" class="btn-back">Go back home</router-link>
    </div>

    <div v-else-if="project" class="project-card">
      <router-link to="/" class="btn-back-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        <span>Back to Cards</span>
      </router-link>

      <div class="card-deco-top">✦ ✦ ✦ ✦ ✦</div>

      <h1 class="project-title">{{ project.title }}</h1>
      <p class="project-desc">{{ project.description }}</p>

      <hr class="card-divider" />

      <!-- Photo gallery (rotated Polaroids) -->
      <div v-if="project.project_images && project.project_images.length > 0" class="detail-photos">
        <div
          v-for="(img, idx) in project.project_images"
          :key="idx"
          class="detail-photo"
          :style="{ transform: `rotate(${photoRotations[idx % photoRotations.length]}deg)` }"
        >
          <img :src="img" :alt="'Project photo ' + (idx + 1)" />
        </div>
      </div>

      <!-- Rich text content (from Quill HTML) -->
      <div
        v-if="project.detailed_content_html"
        class="project-content ql-snow"
      >
        <div class="ql-editor" v-html="project.detailed_content_html"></div>
      </div>
      <!-- Fallback: plain text content -->
      <div v-else-if="project.detailed_content" class="project-content" v-html="formattedContent"></div>

      <div v-if="project.link_url" class="project-link-wrapper">
        <a :href="project.link_url" target="_blank" rel="noopener" class="btn-link">
          Explore Live
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>

      <div class="card-deco-bottom">✦ ✦ ✦ ✦ ✦</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '../appwrite.js'
import 'quill/dist/quill.snow.css'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const project = ref(null)
const loading = ref(true)
const error = ref(null)

const photoRotations = [-8, 5, -3, 7, -5, 10, -6, 4]

const formattedContent = computed(() => {
  if (!project.value || !project.value.detailed_content) return ''
  return project.value.detailed_content.replace(/\n/g, '<br>')
})

onMounted(async () => {
  try {
    const docSnap = await databases.getDocument(DATABASE_ID, COLLECTIONS.PROJECTS, props.id)
    project.value = { id: docSnap.$id, ...docSnap }
  } catch (err) {
    console.error('Error fetching project:', err)
    error.value = 'Failed to load project details.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #faf6f0;
  padding: 60px 40px;
}

.loading-state, .error-state {
  text-align: center;
  color: #4a2c2a;
  margin-top: 120px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 44, 42, 0.1);
  border-left-color: #8b263e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mystical-text {
  font-family: 'Romantic', serif;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
}

.project-card {
  background-color: #fffdf9;
  border: 2px solid #4a2c2a;
  border-radius: 16px;
  max-width: 100%;
  width: 100%;
  padding: 48px 60px;
  box-shadow: 0 16px 48px rgba(74, 44, 42, 0.1);
  position: relative;
}

.btn-back-arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8b263e;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 30px;
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.btn-back-arrow:hover {
  transform: translateX(-4px);
}

.card-deco-top, .card-deco-bottom {
  text-align: center;
  color: #c9a063;
  font-size: 1.2rem;
  letter-spacing: 0.3em;
  margin: 15px 0;
}

.project-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: 2.8rem;
  color: #4a2c2a;
  text-align: center;
  margin-bottom: 10px;
}

.project-desc {
  font-size: 1.1rem;
  color: #6e5452;
  text-align: center;
  font-style: italic;
  margin-bottom: 25px;
}

.card-divider {
  border: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #c9a063, transparent);
  margin-bottom: 32px;
}

/* ===== PHOTO GALLERY ===== */
.detail-photos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 36px;
  padding: 10px 0;
}

.detail-photo {
  width: 140px;
  background: #fff;
  border-radius: 3px;
  padding: 8px 8px 28px;
  box-shadow:
    0 4px 20px rgba(74, 34, 30, 0.15),
    0 1px 3px rgba(0,0,0,0.07);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-photo:hover {
  box-shadow: 0 10px 30px rgba(74, 34, 30, 0.22);
  transform: scale(1.05) !important;
}

.detail-photo img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 2px;
  display: block;
}

/* ===== RICH TEXT ===== */
.project-content {
  color: #2b1f1e;
  line-height: 1.85;
  font-size: 1.05rem;
  margin-bottom: 35px;
  border: none !important;
}

.project-content :deep(.ql-editor) {
  padding: 0;
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #2b1f1e;
}

.project-content :deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  display: inline-block;
}

/* Preserve animated GIFs */
.project-content :deep(.ql-editor img[src^="data:image/gif"]),
.project-content :deep(.ql-editor img[src$=".gif"]) {
  object-fit: contain;
}

/* Font size support from Quill size format */
.project-content :deep(.ql-editor span[style*="font-size"]) {
  line-height: 1.4;
}

/* Responsive YouTube iframes — resizable via BlotFormatter handles */
.project-content :deep(.ql-video) {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 6px;
  margin: 14px 0;
  resize: both;
  overflow: auto;
  min-width: 200px;
  min-height: 112px;
}

/* Text alignment */
.project-content :deep(.ql-align-center)  { text-align: center; }
.project-content :deep(.ql-align-right)   { text-align: right; }
.project-content :deep(.ql-align-justify) { text-align: justify; }

.project-content :deep(.ql-editor p) { margin-bottom: 1em; }

.project-content :deep(.ql-editor h1),
.project-content :deep(.ql-editor h2),
.project-content :deep(.ql-editor h3) {
  font-family: 'Romantic', 'Times New Roman', serif;
  color: #8b263e;
  margin-bottom: 0.6em;
}

.project-content :deep(.ql-editor strong) { color: #4a2c2a; }

.project-link-wrapper {
  text-align: center;
  margin-bottom: 12px;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #8b263e;
  color: #ffffff;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-link:hover {
  background-color: #6e1c2f;
  transform: translateY(-2px);
}

.btn-back {
  display: inline-block;
  margin-top: 15px;
  color: #8b263e;
  text-decoration: underline;
  font-weight: 600;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .detail-container {
    padding: 30px 12px;
  }
  .project-card {
    padding: 32px 20px;
  }
  .project-title {
    font-size: 2.1rem;
  }
  .project-desc {
    font-size: 1rem;
  }
  .detail-photos {
    gap: 12px;
    margin-bottom: 24px;
  }
  .detail-photo {
    width: 95px;
    padding: 6px 6px 20px;
  }
  .btn-link {
    padding: 10px 24px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .project-card {
    padding: 24px 14px;
  }
  .project-title {
    font-size: 1.8rem;
  }
}
</style>
