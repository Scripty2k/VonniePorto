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
        <div class="passport-frame">
          <div class="passport-glow"></div>
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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import defaultPassport from '@/assets/images/passport.png'

const sectionEl = ref(null)
const isVisible = ref(false)

const profile = ref({
  greeting: 'Hi, my name is',
  name: 'Siobhan Moors.',
  pronunciation: 'pronounced [Shuh-vohn]',
  bio: 'A short bio blurb about yourself goes here. Talk about your passion, what drives your creative work, and what makes you uniquely you.',
  tags: ['🎨 Design', '💻 Dev', '✨ Creative'],
  passport_image: null
})

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
  background: radial-gradient(circle, rgba(201, 90, 90, 0.15), transparent);
  top: -100px;
  left: -150px;
  animation: blobDrift1 12s ease-in-out infinite alternate;
}

.info-blob--2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 38, 62, 0.1), transparent);
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
  background: linear-gradient(90deg, #801424, #c0392b, #e8a0a0);
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
  color: #c9a063;
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
  background: rgba(128, 20, 36, 0.08);
  border: 1.5px solid rgba(128, 20, 36, 0.18);
  color: #801424;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.88rem;
  font-family: 'Brisket', sans-serif;
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

.info-passport {
  width: clamp(300px, 40vw, 540px);
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
  transition: transform 0.4s ease;
}

.info-passport:hover {
  transform: rotate(6deg) scale(1.03);
  box-shadow:
    0 30px 80px rgba(74, 34, 30, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.15);
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

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .info-content {
    flex-direction: column;
    text-align: center;
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
}

@media (max-width: 480px) {
  .info-section { padding: 60px 20px; }
}
</style>