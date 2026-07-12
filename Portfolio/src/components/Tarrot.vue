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
          @click.prevent="handleCardClick(project)"
          class="card-container"
          draggable="false"
          :style="{ animationDelay: (index * 0.12) + 's' }"
          :class="{ 'card-reveal': cardsVisible }"
        >
          <!-- Glow aura -->
          <div class="card-aura"></div>

          <div class="card-inner">
            <div class="card-back">
              <img :src="getCardBack(project)" alt="Card Back" class="card-back-img" draggable="false" />
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

    <!-- ===================== FULL-SCREEN CARD POPUP ===================== -->
    <Teleport to="body">
      <div class="card-overlay" :class="{ 'is-open': popupOpen }" @click.self="closePopup">
        <div class="card-popup" :class="{ 'is-open': popupOpen }">

          <!-- Close button -->
          <button class="card-popup-close" @click="closePopup" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <template v-if="activeProject">
            <!-- Eyebrow -->
            <div class="card-popup-eyebrow">✦ Portfolio ✦</div>

            <!-- Title & subtitle -->
            <h2 class="card-popup-title">{{ activeProject.title }}</h2>
            <p class="card-popup-subtitle" v-if="activeProject.description">{{ activeProject.description }}</p>

            <!-- Gold divider -->
            <div class="card-popup-divider"></div>

            <!-- Three-column layout: photos | text | photos -->
            <div class="card-popup-layout">

              <!-- LEFT photos -->
              <div class="card-popup-photos card-popup-photos--left">
                <div
                  v-for="(img, idx) in leftPhotos"
                  :key="'l' + idx"
                  class="card-popup-photo"
                  :style="{ transform: `rotate(${photoRotations[idx % photoRotations.length]}deg)` }"
                  @click.stop="openLightbox(img)"
                >
                  <img :src="img" :alt="'Photo ' + (idx + 1)" />
                </div>

              </div>

              <!-- CENTER rich text -->
              <div class="card-popup-text-col">
                <div
                  v-if="activeProject.detailed_content_html"
                  class="card-popup-rich-text ql-snow"
                >
                  <div class="ql-editor" v-html="activeProject.detailed_content_html"></div>
                </div>
                <p v-else-if="activeProject.detailed_content" class="card-popup-plain-text">
                  {{ activeProject.detailed_content }}
                </p>
                <p v-else class="card-popup-placeholder">
                  No details yet — add content from the admin dashboard.
                </p>

                <!-- Link button -->
                <div v-if="activeProject.link_url" class="card-popup-link-wrapper">
                  <a :href="activeProject.link_url" target="_blank" rel="noopener" class="card-popup-link-btn">
                    Explore Live
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </div>

              <!-- RIGHT photos -->
              <div class="card-popup-photos card-popup-photos--right">
                <div
                  v-for="(img, idx) in rightPhotos"
                  :key="'r' + idx"
                  class="card-popup-photo"
                  :style="{ transform: `rotate(${photoRotations[(idx + 3) % photoRotations.length]}deg)` }"
                  @click.stop="openLightbox(img)"
                >
                  <img :src="img" :alt="'Photo ' + (leftPhotos.length + idx + 1)" />
                </div>

              </div>

            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- ===================== PHOTO LIGHTBOX ===================== -->
    <Teleport to="body">
      <div class="lightbox-overlay" :class="{ 'is-open': lightboxOpen }" @click="closeLightbox">
        <button class="lightbox-close" @click.stop="closeLightbox" aria-label="Close Lightbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img v-if="lightboxSrc" :src="lightboxSrc" alt="Zoomed photo" class="lightbox-img" :class="{ 'is-open': lightboxOpen }" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { databases, DATABASE_ID, COLLECTIONS } from '../appwrite.js'
import { Query } from 'appwrite'
import 'quill/dist/quill.snow.css'

// Import all card back images
import cardBack1 from '../assets/cards/card.png'
import cardBack2 from '../assets/cards/card2.png'
import cardBack3 from '../assets/cards/card3.png'

const defaultCardBacks = [cardBack1, cardBack2, cardBack3]

// Simple hash from project id to get a consistent random card per project
const getCardBack = (project) => {
  // If the project has a custom card back uploaded from admin, use it
  if (project.card_back_image) return project.card_back_image
  // Otherwise pick a random default card based on the project id (consistent per project)
  let hash = 0
  const idStr = String(project.id)
  for (let i = 0; i < idStr.length; i++) {
    hash = ((hash << 5) - hash) + idStr.charCodeAt(i)
    hash |= 0
  }
  return defaultCardBacks[Math.abs(hash) % defaultCardBacks.length]
}

const projects = ref([])
const loading = ref(true)

// Popup state
const popupOpen = ref(false)
const activeProject = ref(null)

const photoRotations = [-8, 5, -3, 7, -5, 10, -6, 4]

const leftPhotos = computed(() => {
  const imgs = activeProject.value?.project_images || []
  return imgs.filter((_, i) => i % 2 === 0)
})
const rightPhotos = computed(() => {
  const imgs = activeProject.value?.project_images || []
  return imgs.filter((_, i) => i % 2 !== 0)
})

const openPopup = (project) => {
  activeProject.value = project
  popupOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePopup = () => {
  popupOpen.value = false
  document.body.style.overflow = ''
  setTimeout(() => { activeProject.value = null }, 400)
}

// Lightbox state
const lightboxOpen = ref(false)
const lightboxSrc = ref(null)

const openLightbox = (src) => {
  lightboxSrc.value = src
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
  setTimeout(() => { lightboxSrc.value = null }, 350)
}

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
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      [Query.orderDesc('created_at')]
    )
    projects.value = response.documents.map(doc => ({
      id: doc.$id,
      ...doc
    }))
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

const handleCardClick = (project) => {
  if (isDragging.value) return
  openPopup(project)
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
  font-family: 'Coolvetica', sans-serif;
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

/* ===== CARD INNER ===== */
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  transform-style: preserve-3d;
  -webkit-user-drag: none;
  user-drag: none;
  user-select: none;
  border-radius: 14px;
}

.card-container:hover .card-inner {
  transform: rotateY(180deg);
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
  color: #581a16;
  font-size: 1.4rem;
  animation: decoSpin 4s linear infinite;
}

@keyframes decoSpin {
  from { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1); }
}

.card-title {
  font-family: 'Aroma', sans-serif;
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

/* ===================== FULL-SCREEN POPUP ===================== */
.card-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(20, 8, 8, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
}

.card-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

.card-popup {
  position: relative;
  width: 100%;
  max-width: 1400px;
  max-height: 92vh;
  background: linear-gradient(160deg, #fdf6f0 0%, #fef9f5 60%, #fff0e8 100%);
  border-radius: 22px;
  border: 1.5px solid rgba(201, 160, 99, 0.3);
  overflow: hidden;
  overflow-y: auto;
  padding: 52px 52px 56px;
  transform: scale(0.88) translateY(36px);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.card-popup.is-open {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.card-popup::-webkit-scrollbar { width: 6px; }
.card-popup::-webkit-scrollbar-track { background: transparent; }
.card-popup::-webkit-scrollbar-thumb {
  background: rgba(201, 160, 99, 0.35);
  border-radius: 3px;
}

/* Close button */
.card-popup-close {
  position: absolute;
  top: 18px;
  right: 22px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(128, 20, 36, 0.2);
  background: rgba(255,255,255,0.85);
  color: #801424;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.22s ease;
  z-index: 2;
}

.card-popup-close:hover {
  background: #801424;
  color: #fff;
  border-color: #801424;
  transform: rotate(90deg);
}

.card-popup-close svg {
  width: 17px;
  height: 17px;
}

/* Eyebrow */
.card-popup-eyebrow {
  text-align: center;
  font-family: 'Brisket', serif;
  font-size: 0.78rem;
  letter-spacing: 0.32em;
  color: #c0392b;
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.7;
}

/* Title */
.card-popup-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  color: #4a2c2a;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.1;
}

.card-popup-subtitle {
  font-size: 1.05rem;
  color: #6e5452;
  text-align: center;
  margin-bottom: 0;
  font-family: 'Coolvetica', sans-serif;
}

/* Gold divider */
.card-popup-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #c9a063, transparent);
  margin: 22px 0 28px;
}

/* Three-column layout */
.card-popup-layout {
  display: grid;
  grid-template-columns: 175px 1fr 175px;
  gap: 36px;
  align-items: start;
}

/* Photo columns */
.card-popup-photos {
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
  padding-top: 6px;
}

/* Polaroid-style photo card */
.card-popup-photo {
  width: 128px;
  background: #fff;
  border-radius: 3px;
  padding: 8px 8px 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card-popup-photo:hover {
  box-shadow: 0 10px 30px rgba(74, 34, 30, 0.22);
  transform: scale(1.05) !important;
}

.card-popup-photo img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 2px;
  display: block;
}

.card-popup-photo--placeholder {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf0e8, #fce4d6);
  border: 1.5px dashed rgba(201, 160, 99, 0.35);
}

.card-popup-photo--placeholder span {
  font-size: 1.6rem;
  opacity: 0.38;
}

/* Text column */
.card-popup-text-col {
  padding: 0 6px;
}

/* Rich text Quill viewer */
.card-popup-rich-text {
  background: transparent;
  border: none;
}

.card-popup-rich-text :deep(.ql-editor) {
  padding: 0;
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #3a2020;
}

.card-popup-rich-text :deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  display: inline-block;
}

/* Preserve animated GIFs */
.card-popup-rich-text :deep(.ql-editor img[src^="data:image/gif"]),
.card-popup-rich-text :deep(.ql-editor img[src$=".gif"]) {
  object-fit: contain;
}

/* Font size support from Quill size format */
.card-popup-rich-text :deep(.ql-editor span[style*="font-size"]) {
  line-height: 1.4;
}

/* Responsive YouTube iframes — resizable via BlotFormatter handles */
.card-popup-rich-text :deep(.ql-video) {
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
.card-popup-rich-text :deep(.ql-align-center)  { text-align: center; }
.card-popup-rich-text :deep(.ql-align-right)   { text-align: right; }
.card-popup-rich-text :deep(.ql-align-justify) { text-align: justify; }

.card-popup-rich-text :deep(.ql-editor p) {
  margin-bottom: 1em;
}

.card-popup-rich-text :deep(.ql-editor h1),
.card-popup-rich-text :deep(.ql-editor h2),
.card-popup-rich-text :deep(.ql-editor h3) {
  font-family: 'Romantic', 'Times New Roman', serif;
  color: #801424;
  margin-bottom: 0.6em;
}

.card-popup-rich-text :deep(.ql-editor strong) { color: #5a1e1e; }
.card-popup-rich-text :deep(.ql-editor em) { color: #7a4040; }

.card-popup-plain-text {
  font-family: 'Times New Roman', serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #3a2020;
}

.card-popup-placeholder {
  font-family: 'Times New Roman', serif;
  font-size: 1rem;
  line-height: 1.8;
  color: #b08070;
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
}

/* Live link button */
.card-popup-link-wrapper {
  margin-top: 28px;
  text-align: center;
}

.card-popup-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #801424;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-family: 'Brisket', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: background 0.22s ease, transform 0.22s ease;
}

.card-popup-link-btn:hover {
  background: #5e0f1c;
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 820px) {
  .card-popup-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card-popup-photos {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 0;
    gap: 12px;
  }

  .card-popup-photo {
    width: 95px;
    padding: 6px 6px 20px;
  }

  .card-popup-photos--left { order: 1; }
  .card-popup-text-col   { order: 2; }
  .card-popup-photos--right { order: 3; }

  .card-popup { padding: 48px 18px 40px; }
}

@media (max-width: 768px) {
  .tarot-section {
    padding: 60px 0 40px;
  }
  .section-subtitle {
    font-size: 2.2rem;
  }
  .tarot-grid {
    justify-content: flex-start;
    scroll-snap-type: x mandatory;
    padding: 20px 0 10px;
  }
  .tarot-track {
    gap: 20px;
    padding: 20px 30px 30px;
  }
  .card-container {
    flex: 0 0 220px;
    width: 220px;
    height: 366px;
    scroll-snap-align: center;
  }
  .card-front {
    padding: 16px 14px;
  }
  .card-title {
    font-size: 1.25rem;
  }
  .card-desc {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .section-subtitle {
    font-size: 1.8rem;
  }
  .card-popup {
    max-height: 95vh;
  }
  .card-popup-close {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
}

/* ===================== LIGHTBOX ===================== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(10, 4, 4, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  cursor: zoom-out;
}

.lightbox-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

.lightbox-close {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 2;
  backdrop-filter: blur(8px);
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.lightbox-close svg {
  width: 20px;
  height: 20px;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  transform: scale(0.85);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  cursor: default;
}

.lightbox-img.is-open {
  transform: scale(1);
  opacity: 1;
}

@media (max-width: 480px) {
  .lightbox-overlay {
    padding: 20px;
  }
  .lightbox-close {
    top: 14px;
    right: 14px;
    width: 36px;
    height: 36px;
  }
}
</style>