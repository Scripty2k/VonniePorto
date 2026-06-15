<template>
  <header class="site-header" v-if="showPublicHeader" :class="{ 'scrolled': isScrolled }">
    <!-- Animated shimmer line -->
    <div class="header-shimmer"></div>

    <router-link to="/" class="logo-link" @click="scrollToTop">
      <div class="logo-wrapper">
        <img src="./assets/images/cherry.png" alt="Logo" class="logo-img" />
        <div class="logo-glow"></div>
      </div>
    </router-link>

    <nav class="nav-links">
      <button class="nav-btn" @click="scrollToSection('home')">
        <span class="nav-btn-text">Home</span>
        <span class="nav-btn-shimmer"></span>
      </button>
      <button class="nav-btn" @click="scrollToSection('work')">
        <span class="nav-btn-text">Work</span>
        <span class="nav-btn-shimmer"></span>
      </button>
      <button class="nav-btn" @click="scrollToSection('about')">
        <span class="nav-btn-text">About Me</span>
        <span class="nav-btn-shimmer"></span>
      </button>
      <button class="nav-btn" @click="scrollToSection('contact')">
        <span class="nav-btn-text">Contact</span>
        <span class="nav-btn-shimmer"></span>
      </button>
    </nav>

    <!-- Hamburger Button for Mobile -->
    <button class="hamburger-btn" @click="toggleMobileMenu" :class="{ 'is-active': mobileMenuOpen }" aria-label="Menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </header>

  <!-- Mobile Menu Overlay -->
  <div class="mobile-menu-overlay" :class="{ 'is-open': mobileMenuOpen && showPublicHeader }">
    <nav class="mobile-nav-links">
      <button class="mobile-nav-btn" @click="scrollToSection('home')">
        <span class="mobile-nav-btn-text">Home</span>
      </button>
      <button class="mobile-nav-btn" @click="scrollToSection('work')">
        <span class="mobile-nav-btn-text">Work</span>
      </button>
      <button class="mobile-nav-btn" @click="scrollToSection('about')">
        <span class="mobile-nav-btn-text">About Me</span>
      </button>
      <button class="mobile-nav-btn" @click="scrollToSection('contact')">
        <span class="mobile-nav-btn-text">Contact</span>
      </button>
    </nav>
  </div>

  <div id="app">
    <router-view />
  </div>

  <!-- Floating CV Button & Popup -->
  <div v-if="showPublicHeader" class="cv-overlay-container">
    <!-- Popup Screen -->
    <div :class="['cv-popup', { 'is-open': isCvOpen }]">
      <div class="cv-popup-header">
        <span class="cv-popup-title">Curriculum Vitae</span>
        <button class="cv-popup-close-btn" @click="toggleCv" aria-label="Close CV">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="cv-popup-body">
        <iframe v-if="isCvOpen" :src="`${cvPdf}#toolbar=0&navpanes=0`" class="cv-iframe"></iframe>
      </div>
    </div>

    <button class="cv-floating-btn" @click="toggleCv" :aria-label="isCvOpen ? 'Close CV' : 'Open CV'">
      <div class="cv-btn-inner">
        <svg v-if="isCvOpen" class="cv-btn-icon close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <svg v-else class="cv-btn-icon doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <span class="cv-floating-tooltip">View CV</span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import cvPdf from './assets/images/CV.pdf'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const isCvOpen = ref(false)
const mobileMenuOpen = ref(false)

const toggleCv = () => {
  isCvOpen.value = !isCvOpen.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const showPublicHeader = computed(() => {
  return route.path && !route.path.startsWith('/admin')
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40
}

const scrollToTop = () => {
  mobileMenuOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToSection = (sectionId) => {
  mobileMenuOpen.value = false
  // If not on home page, navigate first then scroll
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    })
    return
  }
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
@import './assets/fonts/fonts.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Brisket', sans-serif;
  background-color: #9e7a73;
  overflow-x: hidden;
}

#app {
  font-family: sans-serif;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* ===== HEADER ===== */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(233, 222, 202, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.site-header.scrolled {
  padding: 10px 40px;
  background: rgba(233, 222, 202, 0.95);
  box-shadow: 0 8px 32px rgba(53, 22, 23, 0.18);
}

/* Animated shimmer sweep across header */
.header-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.28) 50%,
    transparent 80%
  );
  animation: headerShimmerSweep 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes headerShimmerSweep {
  0% { left: -60%; opacity: 0; }
  10% { opacity: 1; }
  60% { left: 140%; opacity: 1; }
  70% { opacity: 0; }
  100% { left: 140%; opacity: 0; }
}

/* Logo */
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.logo-img {
  height: 52px;
  width: auto;
  display: block;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 2px 8px rgba(122, 28, 28, 0.2));
  position: relative;
  z-index: 1;
}

.logo-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(233, 222, 202, 0.6) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.logo-wrapper:hover .logo-img {
  transform: rotate(-15deg) scale(1.12);
}

.logo-wrapper:hover .logo-glow {
  opacity: 1;
}

/* Nav */
.nav-links {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-btn {
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: #351617;
  background: rgba(233, 222, 202, 0.85);
  border: 1.5px solid rgba(233, 222, 202, 0.95);
  padding: 10px 22px;
  font-size: 15px;
  font-family: 'Brisket', sans-serif;
  font-weight: 600;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(53, 22, 23, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
}

.nav-btn-text {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

/* shimmer fill on hover */
.nav-btn-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #351617 0%, #801424 50%, #351617 100%);
  background-size: 200% 200%;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 30px;
}

.nav-btn:hover .nav-btn-shimmer {
  opacity: 1;
  animation: btnShimmer 1.5s ease infinite;
}

@keyframes btnShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.nav-btn:hover .nav-btn-text {
  color: #ffffff;
}

.nav-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(53, 22, 23, 0.28);
  border-color: transparent;
}

.nav-btn:active {
  transform: translateY(-1px);
}

@media (min-width: 1024px) {
  .logo-img {
    height: 68px;
  }

  .nav-links {
    gap: 20px;
  }

  .nav-btn {
    font-size: 18px;
    padding: 12px 28px;
  }
}

@media (max-width: 600px) {
  .site-header {
    padding: 12px 16px;
  }
  .nav-btn {
    font-size: 13px;
    padding: 8px 14px;
  }
  .logo-img {
    height: 40px;
  }
}

/* Global text selection styles */
::selection {
  background-color: #351617;
  color: #ffffff;
}

::-moz-selection {
  background-color: #351617;
  color: #ffffff;
}

/* ===== FLOATING CV BUTTON & POPUP ===== */
.cv-overlay-container {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 2000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.cv-floating-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #351617 0%, #801424 100%);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 16px rgba(53, 22, 23, 0.35);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: visible;
  padding: 0;
}

.cv-floating-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 8px 24px rgba(53, 22, 23, 0.5);
  background: linear-gradient(135deg, #801424 0%, #a83232 100%);
}

.cv-floating-btn:active {
  transform: scale(0.95);
}

.cv-btn-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.cv-btn-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  stroke: currentColor;
}

.close-icon {
  animation: iconRotate 0.3s ease;
}

@keyframes iconRotate {
  from { transform: rotate(-90deg) scale(0.8); }
  to { transform: rotate(0deg) scale(1); }
}

.cv-floating-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  background-color: rgba(43, 31, 30, 0.9);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
  border: 1px solid rgba(201, 160, 99, 0.3);
}

.cv-floating-btn:hover .cv-floating-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.cv-popup {
  position: fixed;
  right: 30px;
  bottom: 100px;
  width: min(85vw, 750px);
  height: min(75vh, 800px);
  background-color: #ffffff;
  border-radius: 12px;
  border: 1.5px solid #c9a063;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1999;
  
  transform-origin: bottom right;
  transform: scale(0);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
              opacity 0.3s ease, 
              visibility 0.4s;
}

.cv-popup.is-open {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.cv-popup-header {
  padding: 14px 20px;
  background-color: #faf6f0;
  border-bottom: 1px solid #e8e2d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cv-popup-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: #4a2c2a;
}

.cv-popup-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.cv-popup-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #8b263e;
}

.cv-popup-close-btn svg {
  width: 18px;
  height: 18px;
}

.cv-popup-body {
  flex-grow: 1;
  background-color: #525659;
  position: relative;
}

.cv-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

@media (max-width: 600px) {
  .cv-overlay-container {
    right: 20px;
    bottom: 20px;
  }
  .cv-popup {
    right: 20px;
    bottom: 85px;
    width: calc(100vw - 40px);
    height: 65vh;
  }
}

/* ===== MOBILE NAVIGATION ===== */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1010;
  position: relative;
}

.hamburger-line {
  width: 100%;
  height: 2.5px;
  background-color: #351617;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-btn.is-active .hamburger-line:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger-btn.is-active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-btn.is-active .hamburger-line:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(233, 222, 202, 0.98);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  z-index: 1005;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
  pointer-events: none;
}

.mobile-menu-overlay.is-open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.mobile-nav-btn {
  background: transparent;
  border: none;
  font-family: 'Brisket', sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #351617;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  padding: 8px 20px;
}

.mobile-nav-btn:hover, .mobile-nav-btn:active {
  transform: scale(1.1);
  color: #801424;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hamburger-btn {
    display: flex;
  }
}
</style>