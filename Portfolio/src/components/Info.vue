<template>
  <section class="info-section" ref="sectionEl">
    <!-- Decorative background blobs -->
    <div class="info-blob info-blob--1" aria-hidden="true"></div>
    <div class="info-blob info-blob--2" aria-hidden="true"></div>

    <div class="info-content" :class="{ 'visible': isVisible }">
      <!-- Text side -->
      <div class="info-text">
        <div class="info-tag">✦ About Me ✦</div>
        <h1 class="info-heading">
          <span class="info-greeting">{{ profile.greeting }}</span><br />
          <span class="info-name">{{ profile.name }}</span>
        </h1>
        <p class="info-sub">{{ profile.pronunciation }}</p>

        <div class="info-divider">
          <span class="divider-line"></span>
          <span class="divider-icon">✦</span>
          <span class="divider-line"></span>
        </div>

        <p class="info-bio">
          {{ profile.bio }}
        </p>

        <!-- Decorative badges -->
        <div class="info-badges">
          <span v-for="(tag, idx) in profile.tags" :key="idx" class="badge">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Passport side -->
      <div class="info-passport-wrapper">
        <div class="passport-frame" @click="openPopup">
          <div class="passport-glow"></div>

          <!-- Click-me bubble hint -->
          <div class="click-hint">
            <span class="click-hint-text">Click me!</span>
            <div class="click-hint-dot"></div>
          </div>

          <img
            class="info-passport"
            :src="profile.passport_image || defaultPassport"
            alt="Passport"
            draggable="false"
          />
          <!-- Floating decorative ring -->
          <div class="passport-ring passport-ring--1"></div>
          <div class="passport-ring passport-ring--2"></div>
        </div>
      </div>
    </div>

    <!-- ===================== FULL-SCREEN POPUP ===================== -->
    <Teleport to="body">
      <div class="passport-overlay" :class="{ 'is-open': popupOpen }" @click.self="closePopup">
        <div class="passport-popup" :class="{ 'is-open': popupOpen }">

          <!-- Close button -->
          <button class="popup-close-btn" @click="closePopup" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Decorative title -->
          <div class="popup-eyebrow">✦ A Little More About Me ✦</div>

          <!-- Main three-column layout (sketch-style) -->
          <div class="popup-layout">

            <!-- LEFT photo column -->
            <div class="popup-photos popup-photos--left">
              <div
                v-for="(img, idx) in leftPhotos"
                :key="'l' + idx"
                class="popup-photo-card"
                :style="{ transform: `rotate(${photoRotations[idx % photoRotations.length]}deg)` }"
              >
                <img :src="img" :alt="'Photo ' + (idx + 1)" />
              </div>
              <!-- Placeholder frames if no images -->
              <template v-if="leftPhotos.length === 0">
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(-8deg)">
                  <span>📷</span>
                </div>
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(5deg)">
                  <span>📷</span>
                </div>
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(-3deg)">
                  <span>📷</span>
                </div>
              </template>
            </div>

            <!-- CENTER text column -->
            <div class="popup-text-col">
              <div
                v-if="profile.popup_content"
                class="popup-rich-text ql-snow"
              >
                <div class="ql-editor" v-html="profile.popup_content"></div>
              </div>
              <p v-else class="popup-placeholder-text">
                Share your story here — add rich text and photos from the admin dashboard.
              </p>
            </div>

            <!-- RIGHT photo column -->
            <div class="popup-photos popup-photos--right">
              <div
                v-for="(img, idx) in rightPhotos"
                :key="'r' + idx"
                class="popup-photo-card"
                :style="{ transform: `rotate(${photoRotations[(idx + 3) % photoRotations.length]}deg)` }"
              >
                <img :src="img" :alt="'Photo ' + (leftPhotos.length + idx + 1)" />
              </div>
              <!-- Placeholder frames if no images -->
              <template v-if="rightPhotos.length === 0">
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(7deg)">
                  <span>📷</span>
                </div>
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(-4deg)">
                  <span>📷</span>
                </div>
                <div class="popup-photo-card popup-photo-placeholder" style="transform: rotate(10deg)">
                  <span>📷</span>
                </div>
              </template>
            </div>

          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import defaultPassport from '@/assets/images/passport.png'

// Import Quill CSS so rich text renders properly
import 'quill/dist/quill.snow.css'

const sectionEl = ref(null)
const isVisible = ref(false)
const popupOpen = ref(false)

const profile = ref({
  greeting: 'Hi, my name is',
  name: 'Siobhan Moors.',
  pronunciation: 'pronounced [Shuh-vohn]',
  bio: 'A short bio blurb about yourself goes here. Talk about your passion, what drives your creative work, and what makes you uniquely you.',
  tags: ['Design', 'Dev', 'Creative'],
  passport_image: null,
  popup_content: '',
  popup_images: []
})

// Rotations array — alternating left & right tilts
const photoRotations = [-8, 5, -3, 7, -5, 10, -6, 4]

// Split images between left and right columns
const leftPhotos = computed(() => {
  const imgs = profile.value.popup_images || []
  return imgs.filter((_, i) => i % 2 === 0)
})
const rightPhotos = computed(() => {
  const imgs = profile.value.popup_images || []
  return imgs.filter((_, i) => i % 2 !== 0)
})

const openPopup = () => {
  popupOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePopup = () => {
  popupOpen.value = false
  document.body.style.overflow = ''
}

const fetchProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        throw error
      }
    } else if (data) {
      profile.value = data
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

onMounted(async () => {
  await fetchProfile()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) isVisible.value = true
      })
    },
    { threshold: 0.15 }
  )

  if (sectionEl.value) observer.observe(sectionEl.value)
})
</script>

<style scoped>
/* ===== SECTION ===== */
.info-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 6vw;
  box-sizing: border-box;
  overflow: hidden;
}

/* Decorative background blobs */
.info-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.info-blob--1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -150px;
  animation: blobDrift1 12s ease-in-out infinite alternate;
}

.info-blob--2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -100px;
  animation: blobDrift2 10s ease-in-out infinite alternate;
}

@keyframes blobDrift1 {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(60px, 40px) scale(1.1); }
}

@keyframes blobDrift2 {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(-40px, -50px) scale(1.08); }
}

/* ===== CONTENT ===== */
.info-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 4rem;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-content.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== TEXT SIDE ===== */
.info-text {
  flex: 1 1 auto;
  max-width: 600px;
}

.info-tag {
  font-family: 'Brisket', serif;
  font-size: 0.85rem;
  color: #c0392b;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.8;
}

.info-greeting {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: #5a3a3a;
  font-weight: 400;
  font-family: 'Times New Roman', serif;
  font-style: italic;
}

.info-heading {
  font-size: clamp(2.8rem, 6vw, 4.8rem);
  line-height: 1.1;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}

.info-name {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-weight: 800;
  display: block;
  color: #801424;
  text-shadow: 0 2px 20px rgba(128, 20, 36, 0.15);
  position: relative;
}

/* Underline swipe animation */
.info-name::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(90deg, #700b0b, #700b0b, #e9deca);
  border-radius: 2px;
  transition: width 1.2s 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.visible .info-name::after {
  width: 100%;
}

.info-sub {
  font-style: italic;
  color: #888;
  font-size: 1.1rem;
  margin-top: 0.4rem;
  letter-spacing: 0.02em;
}

/* Divider */
.info-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 22px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(128, 20, 36, 0.3), transparent);
}

.divider-icon {
  color: #4b1111;
  font-size: 0.85rem;
  animation: divIconSpin 6s linear infinite;
}

@keyframes divIconSpin {
  to { transform: rotate(360deg); }
}

/* Bio */
.info-bio {
  font-size: 1.05rem;
  color: #4a3030;
  line-height: 1.75;
  font-family: 'Times New Roman', serif;
  margin-bottom: 28px;
}

/* Badges */
.info-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(233, 222, 202);
  border: 1.5px solid rgba(128, 20, 36, 0.18);
  color: #801424;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.88rem;
  font-family: 'Typewriter', sans-serif;
  transition: all 0.3s ease;
  cursor: default;
}

.badge:hover {
  background: rgba(128, 20, 36, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(128, 20, 36, 0.15);
}

/* ===== PASSPORT SIDE ===== */
.info-passport-wrapper {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.passport-frame {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.passport-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse, rgba(201, 160, 99, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: glowPulse 4s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1.05); }
}

/* ===== CLICK ME HINT ===== */
.click-hint {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: none;
  animation: hintBounce 2.2s ease-in-out infinite;
}

.click-hint-text {
  background: linear-gradient(135deg, #801424, #912a1f);
  color: #fff;
  font-family: 'Aroma', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 10px 24px;
  border-radius: 20px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(128, 20, 36, 0.35);
}

.click-hint-text::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #c0392b;
}

.click-hint-dot {
  width: 8px;
  height: 8px;
  background: #c0392b;
  border-radius: 50%;
  opacity: 0.8;
}

@keyframes hintBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-6px); }
}

.info-passport {
  width: clamp(240px, 75vw, 540px);
  height: auto;
  transform: rotate(12deg);
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(74, 34, 30, 0.18),
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(201, 160, 99, 0.15);
  animation: passportFloat 5s ease-in-out infinite;
  position: relative;
  z-index: 1;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.passport-frame:hover .info-passport {
  transform: rotate(6deg) scale(1.03);
  box-shadow:
    0 30px 80px rgba(74, 34, 30, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.15);
  animation-play-state: paused;
}

@keyframes passportFloat {
  0%, 100% { transform: rotate(12deg) translateY(0px); }
  50% { transform: rotate(12deg) translateY(-14px); }
}

/* Decorative orbiting rings */
.passport-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px dashed rgba(201, 160, 99, 0.25);
  pointer-events: none;
}

.passport-ring--1 {
  inset: -30px;
  animation: ringRotate 18s linear infinite;
}

.passport-ring--2 {
  inset: -55px;
  border-color: rgba(128, 20, 36, 0.12);
  animation: ringRotate 28s linear infinite reverse;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

/* ===== FULL-SCREEN POPUP OVERLAY ===== */
.passport-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(20, 8, 8, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.35s ease, visibility 0.35s ease;
}

.passport-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

.passport-popup {
  position: relative;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  background: linear-gradient(160deg, #fdf6f0 0%, #fef9f5 60%, #fff0e8 100%);
  border-radius: 20px;
  border: 1.5px solid rgba(201, 160, 99, 0.3);
  box-shadow:
    0 40px 100px rgba(74, 34, 30, 0.35),
    0 0 0 1px rgba(255,255,255,0.6) inset;
  overflow: hidden;
  overflow-y: auto;
  padding: 48px 40px 52px;
  transform: scale(0.9) translateY(30px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.passport-popup.is-open {
  transform: scale(1) translateY(0);
  opacity: 1;
}

/* Scrollbar styling */
.passport-popup::-webkit-scrollbar { width: 6px; }
.passport-popup::-webkit-scrollbar-track { background: transparent; }
.passport-popup::-webkit-scrollbar-thumb {
  background: rgba(201, 160, 99, 0.35);
  border-radius: 3px;
}

/* Close btn */
.popup-close-btn {
  position: absolute;
  top: 18px;
  right: 22px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(128, 20, 36, 0.2);
  background: rgba(255,255,255,0.8);
  color: #801424;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.popup-close-btn:hover {
  background: #801424;
  color: #fff;
  border-color: #801424;
  transform: rotate(90deg);
}

.popup-close-btn svg {
  width: 16px;
  height: 16px;
}

/* Eyebrow heading */
.popup-eyebrow {
  text-align: center;
  font-family: 'Brisket', serif;
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  color: #c0392b;
  text-transform: uppercase;
  margin-bottom: 32px;
  opacity: 0.75;
}

/* ===== THREE-COLUMN LAYOUT ===== */
.popup-layout {
  display: grid;
  grid-template-columns: 160px 1fr 160px;
  gap: 28px;
  align-items: start;
  min-height: 400px;
}

/* Photo columns */
.popup-photos {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding-top: 10px;
}

.popup-photo-card {
  width: 130px;
  background: #fff;
  border-radius: 4px;
  padding: 8px 8px 28px;
  box-shadow:
    0 4px 20px rgba(74, 34, 30, 0.15),
    0 1px 3px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.popup-photo-card:hover {
  box-shadow: 0 10px 30px rgba(74, 34, 30, 0.22);
  transform: scale(1.04) !important;
}

.popup-photo-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 2px;
  display: block;
}

.popup-photo-placeholder {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf0e8, #fce4d6);
  border: 1.5px dashed rgba(201, 160, 99, 0.35);
}

.popup-photo-placeholder span {
  font-size: 1.8rem;
  opacity: 0.4;
}

/* Text column */
.popup-text-col {
  padding: 0 8px;
}

.popup-rich-text {
  background: transparent;
  border: none;
}

/* Override Quill viewer styles for our design */
.popup-rich-text :deep(.ql-editor) {
  padding: 0;
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #3a2020;
}

.popup-rich-text :deep(.ql-editor p) {
  margin-bottom: 1em;
}

.popup-rich-text :deep(.ql-editor h1),
.popup-rich-text :deep(.ql-editor h2),
.popup-rich-text :deep(.ql-editor h3) {
  font-family: 'Romantic', 'Times New Roman', serif;
  color: #801424;
  margin-bottom: 0.6em;
}

.popup-rich-text :deep(.ql-editor strong) {
  color: #5a1e1e;
}

.popup-rich-text :deep(.ql-editor em) {
  color: #7a4040;
}

.popup-placeholder-text {
  font-family: 'Times New Roman', serif;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #b08070;
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .info-content {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  .info-text {
    max-width: 100%;
  }
  .info-name::after {
    left: 50%;
    transform: translateX(-50%);
  }
  .info-divider { justify-content: center; }
  .info-badges { justify-content: center; }

  /* Passport popup responsive */
  .popup-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 20px;
  }

  .popup-photos {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 0;
    gap: 12px;
  }

  .popup-photo-card {
    width: 90px;
    padding: 6px 6px 20px;
  }

  .popup-photos--left { order: 1; }
  .popup-text-col { order: 2; }
  .popup-photos--right { order: 3; }
}

@media (max-width: 480px) {
  .info-section { padding: 60px 20px; }
  .passport-popup { padding: 40px 16px 40px; }
  .info-passport {
    width: clamp(220px, 80vw, 300px);
    transform: rotate(6deg) !important;
    animation: passportFloatMobile 5s ease-in-out infinite !important;
  }
  .passport-frame:hover .info-passport {
    transform: rotate(3deg) scale(1.02) !important;
  }
  .popup-close-btn {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
}

@keyframes passportFloatMobile {
  0%, 100% { transform: rotate(6deg) translateY(0px); }
  50% { transform: rotate(6deg) translateY(-10px); }
}
</style>