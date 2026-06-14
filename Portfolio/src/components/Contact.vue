<template>
  <section class="contact-section" ref="sectionEl">
    <!-- Decorative floating elements -->
    <div class="contact-deco contact-deco--star1" aria-hidden="true">✦</div>
    <div class="contact-deco contact-deco--star2" aria-hidden="true">✦</div>
    <div class="contact-deco contact-deco--star3" aria-hidden="true">✦</div>

    <div class="contact-inner" :class="{ 'visible': isVisible }">
      <!-- Tag -->
      <div class="contact-tag">✦ Get In Touch ✦</div>

      <h2 class="contact-heading">Let's Create<br /><em>Something Beautiful</em></h2>

      <p class="contact-sub">
        Have a project in mind? I'd love to hear from you.
      </p>

      <!-- Email button -->
      <a href="mailto:hello@yourname.com" class="contact-email-btn">
        <span class="btn-text">Say Hello</span>
        <span class="btn-icon">✉</span>
        <span class="btn-shine"></span>
      </a>

      <!-- Social links -->
      <div class="contact-socials">
        <a href="#" class="social-link" aria-label="Instagram">
          <span class="social-icon">♡</span>
          <span>Instagram</span>
        </a>
        <span class="social-dot">·</span>
        <a href="#" class="social-link" aria-label="LinkedIn">
          <span class="social-icon">◈</span>
          <span>LinkedIn</span>
        </a>
        <span class="social-dot">·</span>
        <a href="#" class="social-link" aria-label="Twitter">
          <span class="social-icon">✦</span>
          <span>Twitter</span>
        </a>
      </div>

      <!-- Footer note -->
      <div class="contact-footer">
        <div class="footer-divider">
          <span></span><span class="footer-icon">✦</span><span></span>
        </div>
        <p class="footer-credit">Crafted with love by scripty2k.com ♡ · {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sectionEl = ref(null)
const isVisible = ref(false)

onMounted(() => {
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
.contact-section {
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 40px;
  overflow: hidden;
  text-align: center;
}

/* Soft bg panel */
.contact-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(128, 20, 36, 0.06) 50%, rgba(128, 20, 36, 0.04) 100%);
  pointer-events: none;
}

/* ===== FLOATING DECO ===== */
.contact-deco {
  position: absolute;
  color: rgba(192, 57, 43, 0.2);
  font-size: 1.5rem;
  pointer-events: none;
  animation: decoFloat 6s ease-in-out infinite;
}

.contact-deco--star1 { top: 14%; left: 8%; animation-delay: 0s; font-size: 1.2rem; }
.contact-deco--star2 { top: 60%; right: 10%; animation-delay: 1.5s; font-size: 1.8rem; }
.contact-deco--star3 { bottom: 18%; left: 18%; animation-delay: 0.8s; font-size: 1rem; }

@keyframes decoFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
  50% { transform: translateY(-16px) rotate(20deg); opacity: 0.5; }
}

/* ===== INNER ===== */
.contact-inner {
  position: relative;
  z-index: 1;
  max-width: 640px;
  width: 100%;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.contact-inner.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== TAG ===== */
.contact-tag {
  font-family: 'Brisket', serif;
  font-size: 0.85rem;
  color: #c0392b;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: 16px;
  opacity: 0.8;
}

/* ===== HEADING ===== */
.contact-heading {
  font-family: 'Romantic', 'Times New Roman', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #801424;
  line-height: 1.15;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(128, 20, 36, 0.12);
}

.contact-heading em {
  font-style: italic;
  color: #4a2c2a;
}

.contact-sub {
  font-size: 1.1rem;
  color: #6e5452;
  font-style: italic;
  margin-bottom: 44px;
  font-family: 'Times New Roman', serif;
}

/* ===== EMAIL BUTTON ===== */
.contact-email-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(135deg, #801424 0%, #c0392b 50%, #801424 100%);
  background-size: 200% 200%;
  padding: 16px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-family: 'Brisket', sans-serif;
  letter-spacing: 0.05em;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 24px rgba(128, 20, 36, 0.3), 0 2px 8px rgba(0,0,0,0.1);
  animation: btnGradientShift 4s ease infinite;
}

@keyframes btnGradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn-text { position: relative; z-index: 1; }
.btn-icon { position: relative; z-index: 1; font-size: 1.2rem; }

.btn-shine {
  position: absolute;
  top: 0; left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%);
  animation: btnShineSweep 3s ease-in-out infinite;
}

@keyframes btnShineSweep {
  0% { left: -60%; }
  60% { left: 140%; }
  100% { left: 140%; }
}

.contact-email-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 16px 40px rgba(128, 20, 36, 0.4);
}

.contact-email-btn:active {
  transform: translateY(-1px);
}

/* ===== SOCIALS ===== */
.contact-socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #6e5452;
  font-size: 0.9rem;
  font-family: 'Brisket', sans-serif;
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-icon {
  font-size: 1rem;
  color: #c9a063;
  transition: transform 0.3s ease;
}

.social-link:hover {
  color: #801424;
  transform: translateY(-2px);
}

.social-link:hover .social-icon {
  transform: scale(1.3) rotate(15deg);
}

.social-dot {
  color: rgba(128, 20, 36, 0.3);
  font-size: 1.2rem;
}

/* ===== FOOTER ===== */
.contact-footer {
  margin-top: 60px;
}

.footer-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-divider span:first-child,
.footer-divider span:last-child {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(128, 20, 36, 0.2), transparent);
  display: block;
}

.footer-icon {
  color: #c9a063;
  font-size: 0.8rem;
  flex: 0;
  animation: divIconSpin 8s linear infinite;
}

@keyframes divIconSpin {
  to { transform: rotate(360deg); }
}

.footer-credit {
  font-size: 0.85rem;
  color: rgba(74, 44, 42, 0.5);
  letter-spacing: 0.1em;
  font-family: 'Times New Roman', serif;
  font-style: italic;
}
</style>