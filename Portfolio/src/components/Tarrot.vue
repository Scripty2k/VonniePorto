<template>
  <div class="tarot-section" ref="sectionEl">
    <!-- Section heading -->
    <div class="section-header" :class="{ 'visible': headerVisible }">
      <div class="section-tag">✦ Portfolio ✦</div>
      <h2 class="section-subtitle">Pick a card, any card</h2>
      <p class="section-desc">Each card reveals a chapter of my work</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner-wrapper">
        <div class="spinner-outer"></div>
        <div class="spinner-inner"></div>
        <div class="spinner-dot"></div>
      </div>
      <p class="loading-text">Dealing the cards of fate...</p>
    </div>

    <div v-else-if="projects.length === 0" class="empty-state">
      <div class="empty-icon">✦</div>
      <p>The deck is empty. Add projects in the admin panel!</p>
    </div>

    <div v-else
      class="tarot-grid"
      ref="scrollContainer"
      @mousedown="onMouseDown"
      @mouseleave="onMouseLeave"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
      :class="{ 'active': isDown }"
    >
      <div class="tarot-track">
        <a
          v-for="(project, index) in projects"
          :key="project.id"
          href="#"
          @click.prevent="handleCardClick(project.id)"
          class="card-container"
          draggable="false"
          :style="{ animationDelay: (index * 0.12) + 's' }"
          :class="{ 'card-reveal': cardsVisible }"
        >
          <!-- Glow aura -->
          <div class="card-aura"></div>

          <div class="card-inner">
            <div class="card-back">
              <img src="../assets/cards/card.png" alt="Card Back" class="card-back-img" draggable="false" />
              <div class="card-back-overlay"></div>
            </div>

            <div class="card-front">
              <div class="card-front-border-anim"></div>
              <div class="card-front-content">
                <div class="card-front-deco">✦</div>
                <h3 class="card-title">{{ project.title }}</h3>
                <div class="card-divider"></div>
                <p class="card-desc">{{ project.description || 'Click to reveal full details' }}</p>
                <div class="card-action-text">
                  <span>Reveal Details</span>
                  <span class="card-arrow">→</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Scroll hint -->
    <p class="drag-hint" v-if="projects.length > 0" :class="{ 'visible': cardsVisible }">
      ← drag to explore →
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'

const router = useRouter()
const projects = ref([])
const loading = ref(true)

// Drag-to-scroll states
const scrollContainer = ref(null)
const isDown = ref(false)
const isDragging = ref(false)
let startX = 0
let scrollLeft = 0

// Mobile center tracking
const centeredIndex = ref(null)

// Intersection observer for animations
const sectionEl = ref(null)
const headerVisible = ref(false)
const cardsVisible = ref(false)

const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    projects.value = data
  } catch (err) {
    console.error('Error fetching projects:', err)
  } finally {
    loading.value = false
    setTimeout(() => { 
      cardsVisible.value = true 
      updateCenterCard()
    }, 200)
  }
}

const updateCenterCard = () => {
  if (!scrollContainer.value || window.innerWidth > 768) return

  const container = scrollContainer.value
  const containerMid = container.getBoundingClientRect().left + container.offsetWidth / 2
  
  let closestIndex = 0
  let closestDistance = Infinity

  const cards = container.querySelectorAll('.card-container')
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect()
    const cardMid = rect.left + rect.width / 2
    const distance = Math.abs(containerMid - cardMid)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })

  centeredIndex.value = closestIndex
}

const onScroll = () => {
  updateCenterCard()
}

onMounted(() => {
  fetchProjects()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          headerVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  if (sectionEl.value) observer.observe(sectionEl.value)
  
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', onScroll)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', onScroll)
  }
})

// Drag-to-scroll event handlers
const onMouseDown = (e) => {
  isDown.value = true
  isDragging.value = false
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

const onMouseLeave = () => {
  isDown.value = false
}

const onMouseUp = () => {
  isDown.value = false
}

const onMouseMove = (e) => {
  if (!isDown.value) return
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 1.5

  if (Math.abs(walk) > 5) {
    isDragging.value = true
  }

  if (isDragging.value) {
    e.preventDefault()
    scrollContainer.value.scrollLeft = scrollLeft - walk
    updateCenterCard()
  }
}

const handleCardClick = (projectId) => {
  if (isDragging.value) return
  router.push('/project/' + projectId)
}
</script>

<style scoped>
/* ===== SECTION ===== */
.tarot-section {
  width: 100%;
  max-width: 100%;
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
}

/* ===== SECTION HEADER ===== */
.section-header {
  padding: 0 40px;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-tag {
  font-family: 'Brisket', serif;
  font-size: 0.85rem;
  color: #c0392b;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 12px;
  animation: tagFade 2s ease-in-out infinite alternate;
}

@keyframes tagFade {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

.section-subtitle {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: 3rem;
  color: #8b263e;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 16px rgba(139, 38, 62, 0.15);
  margin-bottom: 12px;
}

.section-desc {
  font-size: 1rem;
  color: #6e5452;
  font-style: italic;
}

/* ===== LOADING ===== */
.loading-state {
  padding: 80px 0;
  color: #6e5452;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
}

.spinner-outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #8b263e;
  animation: spin 1.2s linear infinite;
}

.spinner-inner {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: rgba(139, 38, 62, 0.4);
  animation: spin 0.8s linear infinite reverse;
}

.spinner-dot {
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  background: #8b263e;
  animation: dotPulse 1s ease-in-out infinite alternate;
}

@keyframes dotPulse {
  from { transform: scale(0.6); opacity: 0.4; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.95rem;
  font-style: italic;
  color: #8b263e;
}

/* ===== EMPTY ===== */
.empty-state {
  padding: 80px 0;
  color: #6e5452;
}

.empty-icon {
  font-size: 3rem;
  color: #c9a063;
  margin-bottom: 16px;
  animation: emptyFloat 3s ease-in-out infinite;
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(20deg); }
}

/* ===== GRID ===== */
.tarot-grid {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  padding: 30px 0 20px;
}

.tarot-track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 36px;
  padding: 30px 60px 40px;
  margin: 0 auto;
}

/* ===== CARD CONTAINER ===== */
.card-container {
  position: relative;
  flex: 0 0 240px;
  width: 250px;
  height: 416px;
  perspective: 1000px;
  text-decoration: none;
  cursor: pointer;
  -webkit-user-drag: none;
  user-drag: none;
  user-select: none;
  opacity: 0;
  transform: translateY(40px) scale(0.94);
  transition: none;
}

.card-container.card-reveal {
  animation: cardReveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Card aura glow */
.card-aura {
  position: absolute;
  inset: -8px;
  border-radius: 16px;
  background: radial-gradient(ellipse at center, rgba(139, 38, 62, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
  filter: blur(10px);
}

.card-container:hover .card-aura {
  opacity: 1;
}

.card-container:hover {
  transform: translateY(-8px) !important;
}

/* ===== CARD INNER ===== */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  -webkit-user-drag: none;
  user-drag: none;
  user-select: none;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(139, 38, 62, 0.18), 0 2px 8px rgba(0,0,0,0.12);
}

.card-container:hover .card-inner {
  transform: rotateY(180deg);
  box-shadow: 0 20px 50px rgba(139, 38, 62, 0.35), 0 4px 16px rgba(0,0,0,0.2);
}

/* ===== BACK & FRONT ===== */
.card-back, .card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 14px;
  overflow: hidden;
}

.card-back {
  background: transparent;
}

.card-back-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  -webkit-user-drag: none;
}

.card-back-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(60, 10, 20, 0.3) 100%);
  pointer-events: none;
}

/* ===== CARD FRONT ===== */
.card-front {
  background: linear-gradient(145deg, #fffdf8 0%, #fdf5ec 100%);
  color: #2b1f1e;
  border: 1.5px solid rgba(139, 38, 62, 0.3);
  transform: rotateY(180deg);
  padding: 22px 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Animated border sweep on front */
.card-front-border-anim {
  position: absolute;
  inset: 4px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  background-clip: padding-box;
  pointer-events: none;
}

.card-container:hover .card-front-border-anim {
  border-color: rgba(201, 160, 99, 0.35);
}

.card-front-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.card-front-deco {
  color: #c9a063;
  font-size: 1.4rem;
  animation: decoSpin 4s linear infinite;
}

@keyframes decoSpin {
  from { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1); }
}

.card-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: 1.4rem;
  color: #4a2c2a;
  margin: 8px 0 6px;
  line-height: 1.25;
  text-align: center;
}

.card-divider {
  width: 50px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #c9a063, transparent);
  margin: 4px auto;
}

.card-desc {
  font-size: 0.87rem;
  color: #6e5452;
  line-height: 1.45;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
}

.card-action-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #8b263e;
  letter-spacing: 0.08em;
  transition: gap 0.3s ease;
}

.card-arrow {
  transition: transform 0.3s ease;
}

.card-container:hover .card-action-text {
  gap: 10px;
}

.card-container:hover .card-arrow {
  transform: translateX(4px);
}

/* ===== DRAG HINT ===== */
.drag-hint {
  font-size: 0.8rem;
  color: rgba(139, 38, 62, 0.5);
  letter-spacing: 0.1em;
  margin-top: 12px;
  opacity: 0;
  transition: opacity 1s 1.2s ease;
  font-style: italic;
}

.drag-hint.visible {
  opacity: 1;
}
</style>