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
      
      <div class="project-content" v-html="formattedContent"></div>
      
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
import { supabase } from '../supabase.js'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const project = ref(null)
const loading = ref(true)
const error = ref(null)

const formattedContent = computed(() => {
  if (!project.value || !project.value.detailed_content) return ''
  // Convert newlines to breaks for basic rich text support
  return project.value.detailed_content.replace(/\n/g, '<br>')
})

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', props.id)
      .single()

    if (fetchError) throw fetchError
    project.value = data
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
  align-items: center;
  min-height: 100vh;
  background-color: #faf6f0; /* Cream background */
  padding: 40px 20px;
}

.loading-state, .error-state {
  text-align: center;
  color: #4a2c2a;
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
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(74, 44, 42, 0.08);
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
  color: #c9a063; /* warm gold */
  font-size: 1.2rem;
  letter-spacing: 0.3em;
  margin: 15px 0;
}

.project-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: 2.5rem;
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
  margin-bottom: 30px;
}

.project-content {
  color: #2b1f1e;
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 35px;
}

.project-link-wrapper {
  text-align: center;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #8b263e; /* cherry red */
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 6px;
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
</style>
