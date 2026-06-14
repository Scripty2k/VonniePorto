<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-deco">✦</div>
      <h1 class="login-title">Sanctum Login</h1>
      <p class="login-subtitle">Enter credentials to modify the cards of fate.</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Admin Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="admin@example.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Security Phrase</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
          />
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Unlocking...' : 'Reveal Dashboard' }}
        </button>
      </form>
      
      <router-link to="/" class="back-home">Return to Portfolio</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    // Redirect to Admin Dashboard on success
    router.push('/admin/dashboard')
  } catch (err) {
    console.error('Login error:', err)
    errorMessage.value = err.message || 'Authentication failed.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2b1f1e; /* Darker, mysterious background */
  padding: 20px;
}

.login-card {
  background-color: #faf6f0; /* Cream card */
  border: 2px solid #c9a063; /* Gold border */
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.card-deco {
  color: #c9a063;
  font-size: 2rem;
  margin-bottom: 10px;
}

.login-title {
  font-family: 'Romantic', 'Times New Roman', serif;
  color: #4a2c2a;
  font-size: 2rem;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 0.9rem;
  color: #6e5452;
  margin-bottom: 30px;
  line-height: 1.4;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4a2c2a;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #c9a063;
  background-color: #fffdf9;
  border-radius: 6px;
  color: #2b1f1e;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #8b263e;
  box-shadow: 0 0 0 3px rgba(139, 38, 62, 0.15);
}

.error-banner {
  background-color: rgba(139, 38, 62, 0.1);
  border-left: 3px solid #8b263e;
  padding: 10px 15px;
  color: #8b263e;
  font-size: 0.85rem;
  margin-bottom: 20px;
  border-radius: 4px;
}

.btn-submit {
  width: 100%;
  background-color: #8b263e;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-submit:hover {
  background-color: #6e1c2f;
}

.btn-submit:active {
  transform: scale(0.98);
}

.btn-submit:disabled {
  background-color: #c9a063;
  cursor: not-allowed;
}

.back-home {
  display: inline-block;
  margin-top: 25px;
  font-size: 0.85rem;
  color: #8b263e;
  text-decoration: none;
  font-weight: 600;
}

.back-home:hover {
  text-decoration: underline;
}
</style>
