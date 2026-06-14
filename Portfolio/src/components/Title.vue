<template>
  <div class="title-section-container" ref="container">
    <!-- Sparkle burst particles on mount -->
    <div class="sparkle-field" aria-hidden="true">
      <span v-for="n in 12" :key="n" class="sparkle" :style="getSparkleStyle(n)">✦</span>
    </div>

    <div class="title-wrapper" :class="{ 'animate-in': mounted }">
      <!-- Decorative ring -->
      <div class="title-ring"></div>
      <div class="title-ring title-ring--outer"></div>

      <img src="../assets/images/bow.png" alt="Bow Sticker" class="sticker sticker-bow" />
      <img src="../assets/images/cherry.png" alt="Cherry Sticker" class="sticker sticker-cherry" />

      <h1 class="main-title">
        <span v-for="(char, ci) in titleChars" :key="ci"
          class="title-char"
          :style="{ animationDelay: (ci * 0.06) + 's' }"
        >{{ char === ' ' ? '\u00A0' : char }}</span>
      </h1>

      <img src="../assets/images/star.png" alt="Star Top Sticker" class="sticker sticker-star-top" />
      <img src="../assets/images/star.png" alt="Star Bottom Sticker" class="sticker sticker-star-bottom" />
    </div>

    <p class="subtitle" :class="{ 'animate-in': mounted }">
      <span class="subtitle-inner">{{ displayedMotto }}<span class="cursor-blink" v-if="typing">|</span></span>
    </p>

    <!-- Scroll cue -->
    <div class="scroll-cue" :class="{ 'animate-in': mounted }">
      <div class="scroll-arrow"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Page Title'
  }
})

const mounted = ref(false)
const displayedMotto = ref('')
const typing = ref(true)
const motto = 'Random motto here...'

const titleChars = computed(() => props.title.split(''))

const typeWriter = async () => {
  await new Promise(r => setTimeout(r, 800))
  for (let i = 0; i <= motto.length; i++) {
    displayedMotto.value = motto.slice(0, i)
    await new Promise(r => setTimeout(r, 55))
  }
  typing.value = false
}

const getSparkleStyle = (n) => {
  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
  const radii = [110, 145, 130, 155, 115, 140, 125, 150, 135, 120, 145, 110]
  const sizes = [12, 8, 14, 10, 11, 9, 13, 8, 12, 10, 9, 14]
  const delays = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 0.1, 0.3, 0.5, 0.7, 0.9, 0.15]

  const angle = (angles[n - 1] * Math.PI) / 180
  const r = radii[n - 1]
  const x = Math.cos(angle) * r
  const y = Math.sin(angle) * r

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    fontSize: sizes[n - 1] + 'px',
    animationDelay: delays[n - 1] + 's',
  }
}

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 50)
  typeWriter()
})
</script>

<style scoped>
@font-face {
  font-family: 'Romantic';
  src: url('../assets/fonts/romantic.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ===== CONTAINER ===== */
.title-section-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 20px 100px;
  overflow: visible;
}

/* ===== SPARKLES ===== */
.sparkle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.sparkle {
  position: absolute;
  color: #c0392b;
  opacity: 0;
  animation: sparklePop 3s ease-in-out infinite;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 10px rgba(192, 57, 43, 0.6);
  font-size: 12px;
}

@keyframes sparklePop {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(0deg); }
  40% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.3) rotate(20deg); }
  70% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9) rotate(-10deg); }
}

/* ===== TITLE WRAPPER ===== */
.title-wrapper {
  position: relative;
  display: inline-block;
  padding: 0 80px;
  z-index: 1;
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.title-wrapper.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Decorative rings */
.title-ring {
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  border: 1.5px solid rgba(192, 57, 43, 0.12);
  animation: ringRotate 20s linear infinite;
  pointer-events: none;
}

.title-ring--outer {
  inset: -60px;
  border-color: rgba(192, 57, 43, 0.07);
  border-style: dashed;
  animation-direction: reverse;
  animation-duration: 30s;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

/* ===== MAIN TITLE ===== */
.main-title {
  font-family: 'Romantic', sans-serif;
  font-size: 115px;
  color: #801424;
  line-height: 0.95;
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-shadow:
    3px 3px 0px rgba(128, 20, 36, 0.12),
    0 0 40px rgba(192, 57, 43, 0.08);
  filter: drop-shadow(0 4px 16px rgba(128, 20, 36, 0.15));
}

.title-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(30px) rotate(-8deg);
  animation: charDropIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: 0.2s; /* base delay, overridden per char */
}

@keyframes charDropIn {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

.title-char:hover {
  animation: charWiggle 0.4s ease forwards;
  color: #c0392b;
  cursor: default;
}

@keyframes charWiggle {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.3) rotate(-8deg); }
  75% { transform: scale(1.15) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* ===== SUBTITLE ===== */
.subtitle {
  font-family: 'Times New Roman', serif;
  font-size: 26px;
  font-style: italic;
  color: #2b1f1e;
  margin-top: 36px;
  font-weight: 500;
  letter-spacing: 0.5px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s 0.6s ease, transform 0.8s 0.6s ease;
  z-index: 1;
  position: relative;
}

.subtitle.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cursor-blink {
  display: inline-block;
  animation: blink 0.8s step-end infinite;
  color: #801424;
  font-style: normal;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ===== SCROLL CUE ===== */
.scroll-cue {
  margin-top: 64px;
  opacity: 0;
  animation: none;
  transition: opacity 0.6s 1.8s ease;
  z-index: 1;
}

.scroll-cue.animate-in {
  opacity: 1;
}

.scroll-arrow {
  width: 28px;
  height: 28px;
  border-right: 2.5px solid rgba(128, 20, 36, 0.5);
  border-bottom: 2.5px solid rgba(128, 20, 36, 0.5);
  transform: rotate(45deg);
  margin: 0 auto;
  animation: scrollBounce 1.6s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.5; }
  50% { transform: rotate(45deg) translateY(8px); opacity: 1; }
}

/* ===== STICKERS ===== */
.sticker {
  position: absolute;
  pointer-events: auto;
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease;
  filter: drop-shadow(3px 4px 8px rgba(0,0,0,0.18));
}

.sticker:hover {
  filter: drop-shadow(5px 8px 12px rgba(0,0,0,0.28));
  cursor: pointer;
}

.sticker-bow {
  width: 90px;
  left: -50px;
  top: -50px;
  animation: bow-idle 4s ease-in-out infinite;
}

.sticker-bow:hover {
  transform: translateY(-14px) rotate(-5deg) scale(1.15);
}

.sticker-cherry {
  width: 84px;
  left: -60px;
  bottom: -20px;
  animation: cherry-idle 4.5s ease-in-out infinite;
}

.sticker-cherry:hover {
  transform: rotate(-20deg) scale(1.18);
}

.sticker-star-top {
  width: 68px;
  right: -30px;
  top: -15px;
  animation: star-top-idle 3.5s ease-in-out infinite;
}

.sticker-star-top:hover {
  transform: scale(1.25) rotate(45deg);
}

.sticker-star-bottom {
  width: 52px;
  right: -55px;
  bottom: 0px;
  animation: star-bottom-idle 5s ease-in-out infinite;
}

.sticker-star-bottom:hover {
  transform: scale(1.3) rotate(-45deg);
}

/* Idle Loop Animations */
@keyframes bow-idle {
  0%, 100% { transform: translateY(0) rotate(-15deg); }
  50% { transform: translateY(-10px) rotate(-8deg); }
}

@keyframes cherry-idle {
  0%, 100% { transform: rotate(5deg) scale(1); }
  50% { transform: rotate(-12deg) scale(1.05); }
}

@keyframes star-top-idle {
  0%, 100% { transform: scale(1) rotate(15deg) translateY(0); }
  50% { transform: scale(0.9) rotate(28deg) translateY(-6px); }
}

@keyframes star-bottom-idle {
  0%, 100% { transform: translateY(0) rotate(-20deg); }
  50% { transform: translateY(8px) rotate(-8deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .main-title { font-size: 72px; }
  .subtitle { font-size: 20px; }
  .sticker-bow { width: 65px; left: -25px; top: -35px; }
  .sticker-cherry { width: 60px; left: -30px; bottom: -15px; }
  .sticker-star-top { width: 50px; right: -20px; top: -10px; }
  .sticker-star-bottom { width: 40px; right: -30px; bottom: -5px; }
  .title-wrapper { padding: 0 50px; }
}

@media (max-width: 480px) {
  .main-title { font-size: 52px; }
  .subtitle { font-size: 17px; }
  .title-wrapper { padding: 0 28px; }
  .sticker-bow { width: 50px; left: -15px; top: -25px; }
  .sticker-cherry { width: 45px; left: -20px; bottom: -10px; }
  .sticker-star-top { width: 38px; right: -15px; top: -5px; }
  .sticker-star-bottom { width: 30px; right: -20px; bottom: -5px; }
}
</style>