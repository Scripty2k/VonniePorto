<template>
  <div class="home-container">
    <!-- Animated floating background particles -->
    <div class="bg-particles" aria-hidden="true">
      <span v-for="i in 18" :key="i" class="particle" :style="getParticleStyle(i)"></span>
    </div>

    <!-- Animated gradient overlay that slowly shifts -->
    <div class="bg-gradient-overlay"></div>

    <section id="home" class="section-anchor">
      <Title title="Siobhan Moors" />
    </section>

    <section id="work" class="section-anchor">
      <Tarrot />
    </section>

    <section id="about" class="section-anchor">
      <Info />
    </section>

    <section id="partners" class="section-anchor">
      <Partners />
    </section>

    <section id="contact" class="section-anchor">
      <Contact />
    </section>
  </div>
</template>

<script setup>
import Title from '../components/Title.vue'
import Tarrot from '../components/Tarrot.vue'
import Info from '../components/Info.vue'
import Partners from '../components/Partners.vue'
import Contact from '../components/Contact.vue'

// Generate random but seeded particle styles for consistent render
const getParticleStyle = (i) => {
  const sizes = [8, 12, 6, 16, 10, 14, 7, 9, 11, 13, 5, 18, 8, 12, 6, 10, 15, 7]
  const delays = [0, 1.2, 2.4, 0.6, 3.1, 1.8, 4.2, 0.3, 2.8, 1.5, 3.7, 0.9, 2.1, 4.5, 1.1, 3.3, 0.7, 2.6]
  const durations = [12, 16, 10, 18, 14, 11, 20, 15, 13, 17, 9, 22, 12, 16, 10, 14, 19, 11]
  const lefts = [5, 12, 22, 35, 48, 57, 68, 78, 88, 95, 15, 30, 45, 60, 75, 90, 25, 55]
  const opacities = [0.25, 0.18, 0.3, 0.15, 0.22, 0.28, 0.12, 0.2, 0.26, 0.17, 0.24, 0.14, 0.21, 0.29, 0.16, 0.23, 0.19, 0.27]

  const idx = i - 1
  return {
    width: sizes[idx] + 'px',
    height: sizes[idx] + 'px',
    left: lefts[idx] + '%',
    animationDelay: delays[idx] + 's',
    animationDuration: durations[idx] + 's',
    opacity: opacities[idx],
  }
}
</script>

<style scoped>
.home-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(160deg, #e9deca 0%, #e9deca 30%, #e9deca 60%, #e9deca 100%);
  padding-top: 100px; /* offset for fixed header */
  overflow-x: hidden;
}

/* Floating gradient overlay */
.bg-gradient-overlay {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(53, 22, 23, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 38, 62, 0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(233, 222, 202, 0.12) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
  animation: overlayPulse 8s ease-in-out infinite alternate;
}

@keyframes overlayPulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Section anchors */
.section-anchor {
  position: relative;
  z-index: 1;
  width: 100%;
  scroll-margin-top: 90px; /* offset for the fixed header */
}

/* ===== PARTICLES ===== */
.bg-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(53, 22, 23, 0.5) 0%, rgba(233, 222, 202, 0.25) 60%, transparent 100%);
  animation: particleRise linear infinite;
  filter: blur(1px);
}

@keyframes particleRise {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 0.6; }
  100% {
    transform: translateY(-110vh) scale(0.4) rotate(360deg);
    opacity: 0;
  }
}
</style>
