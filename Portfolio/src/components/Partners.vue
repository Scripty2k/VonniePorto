<template>
  <section v-if="partners.length > 0" class="partners-section" ref="sectionEl">
    <div class="partners-inner" :class="{ 'visible': isVisible }">
      <div class="partners-tag">✦ Partners & Collaborators ✦</div>
      <h2 class="partners-heading">Made With <em>Great People</em></h2>

      <div class="partners-marquee-wrapper">
        <div class="partners-marquee">
          <div class="marquee-track">
            <span v-for="(name, idx) in doubledPartners" :key="idx" class="marquee-item">
              {{ name }} <span class="marquee-dot">✦</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../supabase.js'

const sectionEl = ref(null)
const isVisible = ref(false)
const partners = ref([])

const doubledPartners = computed(() => {
  return [...partners.value, ...partners.value]
})

const fetchPartners = async () => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('name')
      .order('created_at', { ascending: true })

    if (error) throw error
    if (data) {
      partners.value = data.map(p => p.name)
    }
  } catch (err) {
    console.error('Error fetching partners:', err)
  }
}

onMounted(async () => {
  await fetchPartners()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) isVisible.value = true
      })
    },
    { threshold: 0.1 }
  )
  if (sectionEl.value) observer.observe(sectionEl.value)
})
</script>

<style scoped>
/* ===== SECTION ===== */
.partners-section {
  width: 100%;
  padding: 80px 40px;
  overflow: hidden;
  text-align: center;
  position: relative;
}

/* Soft separator line at top */
.partners-section::before {
  content: '';
  display: block;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(128, 20, 36, 0.3), transparent);
  margin: 0 auto 60px;
}

/* ===== INNER ===== */
.partners-inner {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}

.partners-inner.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== TAG ===== */
.partners-tag {
  font-family: 'Brisket', serif;
  font-size: 0.82rem;
  color: #c0392b;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 14px;
  opacity: 0.75;
}

/* ===== HEADING ===== */
.partners-heading {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #801424;
  margin-bottom: 50px;
}

.partners-heading em {
  font-style: italic;
  color: #4a2c2a;
}

/* ===== MARQUEE ===== */
.partners-marquee-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* Fade edges */
.partners-marquee-wrapper::before,
.partners-marquee-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}

.partners-marquee-wrapper::before {
  left: 0;
  background: linear-gradient(90deg, rgba(255, 200, 180, 1), transparent);
}

.partners-marquee-wrapper::after {
  right: 0;
  background: linear-gradient(270deg, rgba(255, 200, 180, 1), transparent);
}

.partners-marquee {
  overflow: hidden;
  width: 100%;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marqueeScroll 22s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 28px;
  font-family: 'Brisket', sans-serif;
  font-size: 1.15rem;
  color: #5a3535;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.marquee-item:hover {
  color: #801424;
}

.marquee-dot {
  color: #250202;
  font-size: 0.7rem;
  animation: dotSpin 4s linear infinite;
  display: inline-block;
}

@keyframes dotSpin {
  to { transform: rotate(360deg); }
}
</style>