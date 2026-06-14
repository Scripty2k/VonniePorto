<template>
  <div class="dashboard-layout">
    <!-- Supabase-style Sidebar -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <div class="logo-area">
          <span class="logo-icon">✦</span>
          <span class="logo-text">Staff Control Panel</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          @click="currentTab = 'tarot'" 
          :class="['nav-item', { active: currentTab === 'tarot' }]"
        >
          <!-- Tarot Cards SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h6" />
          </svg>
          <span>Tarot Cards</span>
        </button>
        
        <button 
          @click="currentTab = 'partners'" 
          :class="['nav-item', { active: currentTab === 'partners' }]"
        >
          <!-- Partners/Collaborators SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Partners</span>
        </button>

        <button 
          @click="currentTab = 'profile'" 
          :class="['nav-item', { active: currentTab === 'profile' }]"
        >
          <!-- Profile/User SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile Info</span>
        </button>
      </nav>
      
      <div class="sidebar-footer">
        <router-link to="/" class="nav-item external-link">
          <!-- External Link SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
          <span>View Site</span>
        </router-link>
        
        <button @click="handleLogout" class="nav-item btn-logout-sidebar">
          <!-- Log Out SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="dashboard-content">
      <header class="content-header">
        <h1 class="content-title">
          <span v-if="currentTab === 'tarot'">Tarot Cards Deck</span>
          <span v-else-if="currentTab === 'partners'">Partners & Collaborators</span>
          <span v-else-if="currentTab === 'profile'">Profile Info (About Me)</span>
        </h1>
        <p class="content-subtitle">
          <span v-if="currentTab === 'tarot'">Configure the dynamic portfolio entries for cards of fate.</span>
          <span v-else-if="currentTab === 'partners'">Manage partner names for the homepage marquee.</span>
          <span v-else-if="currentTab === 'profile'">Edit your bio, professional tags, greeting, and replace or download the passport photo template.</span>
        </p>
      </header>

      <main class="content-body">
        
        <!-- ================= TAROT CARDS TAB ================= -->
        <template v-if="currentTab === 'tarot'">
          <!-- Project Form (Add/Edit) -->
          <section class="form-section">
            <div class="section-card">
              <h2 class="section-title">{{ editingProject ? 'Edit Tarot Card' : 'Create New Tarot Card' }}</h2>
              <form @submit.prevent="saveProject" class="project-form">
                <div class="form-group">
                  <label for="title">Card Title</label>
                  <input 
                    type="text" 
                    id="title" 
                    v-model="projectForm.title" 
                    required 
                    placeholder="e.g. The Hermit / Project Title"
                  />
                </div>

                <div class="form-group">
                  <label for="description">Card Preview Subtitle (Description)</label>
                  <input 
                    type="text" 
                    id="description" 
                    v-model="projectForm.description" 
                    placeholder="Brief 1-2 sentence preview text..."
                  />
                </div>

                <div class="form-group">
                  <label for="link_url">External Project Link (Optional)</label>
                  <input 
                    type="url" 
                    id="link_url" 
                    v-model="projectForm.link_url" 
                    placeholder="https://example.com/project"
                  />
                </div>

                <div class="form-group">
                  <label for="detailed_content">Detailed Content (Full details page)</label>
                  <textarea 
                    id="detailed_content" 
                    v-model="projectForm.detailed_content" 
                    rows="8" 
                    placeholder="Detailed description, process, stack used, etc..."
                  ></textarea>
                </div>

                <div v-if="notification" :class="['notification-banner', notification.type]">
                  {{ notification.text }}
                </div>

                <div class="form-actions">
                  <button type="submit" :disabled="submittingProject" class="btn-primary">
                    {{ submittingProject ? 'Saving...' : (editingProject ? 'Update Card' : 'Deal Card') }}
                  </button>
                  <button 
                    type="button" 
                    v-if="editingProject" 
                    @click="cancelEditProject" 
                    class="btn-cancel"
                  >
                    Cancel Edit
                  </button>
                </div>
              </form>
            </div>
          </section>

          <!-- Projects List -->
          <section class="list-section">
            <div class="section-card">
              <h2 class="section-title">Active Tarot Deck ({{ projects.length }})</h2>
              
              <div v-if="loadingProjects" class="loading-state">
                <div class="spinner"></div>
                <p>Consulting database...</p>
              </div>

              <div v-else-if="projects.length === 0" class="empty-state">
                <p>No tarot cards dealt yet. Create one on the left!</p>
              </div>

              <div v-else class="table-wrapper">
                <table class="projects-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th class="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in projects" :key="p.id">
                      <td class="col-title"><strong>{{ p.title }}</strong></td>
                      <td class="col-desc">{{ p.description || '-' }}</td>
                      <td class="col-actions">
                        <button @click="startEditProject(p)" class="btn-action edit">Edit</button>
                        <button @click="deleteProject(p.id)" class="btn-action delete">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </template>

        <!-- ================= PARTNERS TAB ================= -->
        <template v-else-if="currentTab === 'partners'">
          <!-- Partner Form (Add/Edit) -->
          <section class="form-section">
            <div class="section-card">
              <h2 class="section-title">{{ editingPartner ? 'Edit Partner' : 'Add New Partner' }}</h2>
              <form @submit.prevent="savePartner" class="project-form">
                <div class="form-group">
                  <label for="partner-name">Partner Name</label>
                  <input 
                    type="text" 
                    id="partner-name" 
                    v-model="partnerForm.name" 
                    required 
                    placeholder="e.g. Studio A or Creative Co."
                  />
                </div>

                <div v-if="notification" :class="['notification-banner', notification.type]">
                  {{ notification.text }}
                </div>

                <div class="form-actions">
                  <button type="submit" :disabled="submittingPartner" class="btn-primary">
                    {{ submittingPartner ? 'Saving...' : (editingPartner ? 'Update Partner' : 'Add Partner') }}
                  </button>
                  <button 
                    type="button" 
                    v-if="editingPartner" 
                    @click="cancelEditPartner" 
                    class="btn-cancel"
                  >
                    Cancel Edit
                  </button>
                </div>
              </form>
            </div>
          </section>

          <!-- Partners List -->
          <section class="list-section">
            <div class="section-card">
              <h2 class="section-title">Active Partners & Collaborators ({{ partners.length }})</h2>
              
              <div v-if="loadingPartners" class="loading-state">
                <div class="spinner"></div>
                <p>Fetching partners list...</p>
              </div>

              <div v-else-if="partners.length === 0" class="empty-state">
                <p>No partners added yet. Create one on the left!</p>
              </div>

              <div v-else class="table-wrapper">
                <table class="projects-table">
                  <thead>
                    <tr>
                      <th>Partner Name</th>
                      <th class="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="partner in partners" :key="partner.id">
                      <td class="col-title"><strong>{{ partner.name }}</strong></td>
                      <td class="col-actions">
                        <button @click="startEditPartner(partner)" class="btn-action edit">Edit</button>
                        <button @click="deletePartner(partner.id)" class="btn-action delete">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </template>

        <!-- ================= PROFILE INFO TAB ================= -->
        <template v-else-if="currentTab === 'profile'">
          <!-- Profile Text Form -->
          <section class="form-section">
            <div class="section-card">
              <h2 class="section-title">Edit Profile Blurb</h2>
              <div v-if="loadingProfile" class="loading-state">
                <div class="spinner"></div>
                <p>Fetching profile values...</p>
              </div>
              <form v-else @submit.prevent="saveProfile" class="project-form">
                <div class="form-group">
                  <label for="greeting">Greeting Text</label>
                  <input 
                    type="text" 
                    id="greeting" 
                    v-model="profileForm.greeting" 
                    required 
                    placeholder="e.g. Hi, my name is"
                  />
                </div>

                <div class="form-group">
                  <label for="profile-name">Full Name</label>
                  <input 
                    type="text" 
                    id="profile-name" 
                    v-model="profileForm.name" 
                    required 
                    placeholder="e.g. Siobhan Moors."
                  />
                </div>

                <div class="form-group">
                  <label for="pronunciation">Pronunciation Guide</label>
                  <input 
                    type="text" 
                    id="pronunciation" 
                    v-model="profileForm.pronunciation" 
                    placeholder="e.g. pronounced [Shuh-vohn]"
                  />
                </div>

                <div class="form-group">
                  <label for="bio">Biography / Blurb</label>
                  <textarea 
                    id="bio" 
                    v-model="profileForm.bio" 
                    rows="6" 
                    required
                    placeholder="Tell your story..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="tags">Badges / Skills (Comma-separated)</label>
                  <input 
                    type="text" 
                    id="tags" 
                    v-model="profileForm.tags" 
                    placeholder="🎨 Design, 💻 Dev, ✨ Creative"
                  />
                  <small class="help-text">Separate tags with commas. E.g. 🎨 Design, 💻 Dev</small>
                </div>

                <div v-if="notification" :class="['notification-banner', notification.type]">
                  {{ notification.text }}
                </div>

                <div class="form-actions">
                  <button type="submit" :disabled="savingProfile" class="btn-primary">
                    {{ savingProfile ? 'Saving...' : 'Save Profile' }}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <!-- Passport Image Manager -->
          <section class="list-section">
            <div class="section-card">
              <h2 class="section-title">Passport Graphic Manager</h2>
              
              <div v-if="loadingProfile" class="loading-state">
                <div class="spinner"></div>
                <p>Loading image details...</p>
              </div>

              <div v-else class="passport-manager-content">
                <div class="passport-preview-container">
                  <span class="preview-label">Current Graphic:</span>
                  <div class="passport-preview-frame">
                    <img 
                      :src="profileForm.passport_image || passportTemplate" 
                      alt="Passport Preview" 
                      class="passport-preview-img"
                    />
                  </div>
                  <span class="preview-source">
                    {{ profileForm.passport_image ? '✓ Custom uploaded photo' : '✦ Default bundled template is active' }}
                  </span>
                </div>

                <div class="passport-controls-group">
                  <div class="form-group">
                    <label>Replace Photo</label>
                    <label class="btn-secondary upload-label">
                      <input 
                        type="file" 
                        @change="handleImageUpload" 
                        accept="image/*" 
                        class="file-input-hidden" 
                      />
                      Choose Photo
                    </label>
                    <small class="help-text">JPEG/PNG formatted file, maximum size 2MB</small>
                  </div>

                  <div class="passport-actions">
                    <a 
                      :href="passportTemplate" 
                      download="passport.png" 
                      class="btn-cancel download-template-btn"
                    >
                      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Download Template
                    </a>
                    
                    <button 
                      v-if="profileForm.passport_image" 
                      type="button" 
                      @click="clearPassportImage" 
                      class="btn-action delete btn-reset-photo"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'
import passportTemplate from '../assets/images/passport.png'

const router = useRouter()
const currentTab = ref('tarot')

// Tarot Card States
const projects = ref([])
const loadingProjects = ref(true)
const submittingProject = ref(false)
const editingProject = ref(null)
const projectForm = ref({
  title: '',
  description: '',
  detailed_content: '',
  link_url: ''
})

// Partners States
const partners = ref([])
const loadingPartners = ref(true)
const submittingPartner = ref(false)
const editingPartner = ref(null)
const partnerForm = ref({
  name: ''
})

// Profile / Info States
const profileForm = ref({
  greeting: '',
  name: '',
  pronunciation: '',
  bio: '',
  tags: '',
  passport_image: null
})
const loadingProfile = ref(true)
const savingProfile = ref(false)

const notification = ref(null)

const showNotification = (text, type = 'success') => {
  notification.value = { text, type }
  setTimeout(() => {
    notification.value = null
  }, 4000)
}

// ================= TAROT CARDS CRUD =================

const fetchProjects = async () => {
  loadingProjects.value = true
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    projects.value = data
  } catch (err) {
    console.error('Error loading projects:', err)
    showNotification('Failed to load projects: ' + err.message, 'error')
  } finally {
    loadingProjects.value = false
  }
}

const saveProject = async () => {
  submittingProject.value = true
  try {
    if (editingProject.value) {
      // Update
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: projectForm.value.title,
          description: projectForm.value.description,
          detailed_content: projectForm.value.detailed_content,
          link_url: projectForm.value.link_url
        })
        .eq('id', editingProject.value.id)
        .select()

      if (error) throw error
      showNotification('Tarot card updated successfully!')
      cancelEditProject()
    } else {
      // Insert
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: projectForm.value.title,
            description: projectForm.value.description,
            detailed_content: projectForm.value.detailed_content,
            link_url: projectForm.value.link_url
          }
        ])
        .select()

      if (error) throw error
      showNotification('Tarot card created and dealt!')
      resetProjectForm()
    }
    await fetchProjects()
  } catch (err) {
    console.error('Error saving project:', err)
    showNotification('Failed to save project: ' + err.message, 'error')
  } finally {
    submittingProject.value = false
  }
}

const startEditProject = (project) => {
  editingProject.value = project
  projectForm.value = {
    title: project.title,
    description: project.description || '',
    detailed_content: project.detailed_content || '',
    link_url: project.link_url || ''
  }
}

const cancelEditProject = () => {
  editingProject.value = null
  resetProjectForm()
}

const resetProjectForm = () => {
  projectForm.value = {
    title: '',
    description: '',
    detailed_content: '',
    link_url: ''
  }
}

const deleteProject = async (id) => {
  if (!confirm('Are you sure you want to return this card to the deck (delete)?')) return

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
    showNotification('Tarot card removed.')
    if (editingProject.value && editingProject.value.id === id) {
      cancelEditProject()
    }
    await fetchProjects()
  } catch (err) {
    console.error('Error deleting project:', err)
    showNotification('Failed to delete project: ' + err.message, 'error')
  }
}

// ================= PARTNERS CRUD =================

const fetchPartners = async () => {
  loadingPartners.value = true
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    partners.value = data
  } catch (err) {
    console.error('Error loading partners:', err)
    showNotification('Failed to load partners: ' + err.message, 'error')
  } finally {
    loadingPartners.value = false
  }
}

const savePartner = async () => {
  if (!partnerForm.value.name.trim()) return
  submittingPartner.value = true
  try {
    if (editingPartner.value) {
      // Update
      const { data, error } = await supabase
        .from('partners')
        .update({
          name: partnerForm.value.name.trim()
        })
        .eq('id', editingPartner.value.id)
        .select()

      if (error) throw error
      showNotification('Partner updated successfully!')
      cancelEditPartner()
    } else {
      // Insert
      const { data, error } = await supabase
        .from('partners')
        .insert([
          {
            name: partnerForm.value.name.trim()
          }
        ])
        .select()

      if (error) throw error
      showNotification('Partner added successfully!')
      resetPartnerForm()
    }
    await fetchPartners()
  } catch (err) {
    console.error('Error saving partner:', err)
    showNotification('Failed to save partner: ' + err.message, 'error')
  } finally {
    submittingPartner.value = false
  }
}

const startEditPartner = (partner) => {
  editingPartner.value = partner
  partnerForm.value = {
    name: partner.name
  }
}

const cancelEditPartner = () => {
  editingPartner.value = null
  resetPartnerForm()
}

const resetPartnerForm = () => {
  partnerForm.value = {
    name: ''
  }
}

const deletePartner = async (id) => {
  if (!confirm('Are you sure you want to delete this partner?')) return

  try {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) throw error
    showNotification('Partner deleted.')
    if (editingPartner.value && editingPartner.value.id === id) {
      cancelEditPartner()
    }
    await fetchPartners()
  } catch (err) {
    console.error('Error deleting partner:', err)
    showNotification('Failed to delete partner: ' + err.message, 'error')
  }
}

// ================= PROFILE INFO FUNCTIONS =================

const fetchProfile = async () => {
  loadingProfile.value = true
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
      // Set default inputs if table is empty
      profileForm.value = {
        greeting: 'Hi, my name is',
        name: 'Siobhan Moors.',
        pronunciation: 'pronounced [Shuh-vohn]',
        bio: 'A short bio blurb about yourself goes here. Talk about your passion, what drives your creative work, and what makes you uniquely you.',
        tags: '🎨 Design, 💻 Dev, ✨ Creative',
        passport_image: null
      }
    } else if (data) {
      profileForm.value = {
        greeting: data.greeting || '',
        name: data.name || '',
        pronunciation: data.pronunciation || '',
        bio: data.bio || '',
        tags: data.tags ? data.tags.join(', ') : '',
        passport_image: data.passport_image || null
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    showNotification('Failed to load profile settings: ' + err.message, 'error')
  } finally {
    loadingProfile.value = false
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    // Process comma-separated tags into array
    const tagsArray = profileForm.value.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const { error } = await supabase
      .from('profile')
      .upsert({
        id: 1,
        greeting: profileForm.value.greeting,
        name: profileForm.value.name,
        pronunciation: profileForm.value.pronunciation,
        bio: profileForm.value.bio,
        tags: tagsArray,
        passport_image: profileForm.value.passport_image
      })

    if (error) throw error
    showNotification('Profile updated successfully!')
    await fetchProfile()
  } catch (err) {
    console.error('Error saving profile:', err)
    showNotification('Failed to save profile: ' + err.message, 'error')
  } finally {
    savingProfile.value = false
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Verify file size limit (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showNotification('Photo must be smaller than 2MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.value.passport_image = e.target.result
    showNotification('Photo uploaded to preview. Click "Save Profile" to apply!', 'success')
  }
  reader.readAsDataURL(file)
}

const clearPassportImage = async () => {
  if (!confirm('Are you sure you want to revert to the default template photo?')) return
  profileForm.value.passport_image = null
  showNotification('Photo reset to default template. Click "Save Profile" to apply!', 'success')
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/admin/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

onMounted(() => {
  fetchProjects()
  fetchPartners()
  fetchProfile()
})
</script>

<style scoped>
/* Main Layout & Default System Typography */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #1a1a1a; /* Dark premium background */
  color: #e5e5e5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Supabase-style Sidebar */
.dashboard-sidebar {
  width: 260px;
  background-color: #121212;
  border-right: 1px solid #2e2e2e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #2e2e2e;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-icon {
  color: #c9a063; /* Elegant Gold highlight */
  font-size: 1.25rem;
}

.sidebar-nav {
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

/* Sidebar Navigation Items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: none;
  border: 1px solid transparent;
  color: #9ca3af;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  text-decoration: none;
  width: 100%;
}

.nav-item:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.04);
}

.nav-item.active {
  color: #ffffff;
  background-color: #242424;
  border-color: #333333;
}

.nav-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 14px;
  border-top: 1px solid #2e2e2e;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-logout-sidebar {
  color: #fca5a5;
}

.btn-logout-sidebar:hover {
  background-color: rgba(239, 68, 68, 0.08);
  color: #f87171;
}

/* Main Content Wrapper */
.dashboard-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Header styled with defaults and italic */
.content-header {
  padding: 24px 40px;
  border-bottom: 1px solid #2e2e2e;
  background-color: #141414;
}

.content-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.content-subtitle {
  font-size: 0.88rem;
  color: #9ca3af;
  font-style: italic; /* Requested italic */
  margin: 0;
}

/* Form and list grid layout */
.content-body {
  display: grid;
  grid-template-columns: 1.1fr 1.9fr;
  gap: 32px;
  padding: 32px 40px;
}

@media (max-width: 1100px) {
  .content-body {
    grid-template-columns: 1fr;
  }
}

/* Section Cards */
.section-card {
  background-color: #222222;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
  border-bottom: 1px solid #2e2e2e;
  padding-bottom: 12px;
}

/* Forms styling in dark theme */
.project-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-group input, 
.form-group textarea {
  padding: 11px 14px;
  border: 1px solid #3e3e3e;
  border-radius: 6px;
  font-size: 0.92rem;
  background-color: #1a1a1a;
  color: #e5e5e5;
  transition: all 0.2s ease;
}

.form-group input:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: #c9a063;
  background-color: #1e1e1e;
  box-shadow: 0 0 0 3px rgba(201, 160, 99, 0.15);
}

/* Helper small print */
.help-text {
  font-size: 0.76rem;
  color: #8c9096;
  margin-top: 2px;
  font-style: italic;
}

/* Placeholder font italic support */
.form-group input::placeholder, 
.form-group textarea::placeholder {
  font-style: italic;
  color: #6b7280;
}

/* Notification Banners */
.notification-banner {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 500;
  margin-top: 8px;
}

.notification-banner.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-left: 4px solid #10b981;
}

.notification-banner.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border-left: 4px solid #ef4444;
}

/* Form Action Buttons */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.btn-primary {
  background-color: #8b263e;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #a72f4c;
  box-shadow: 0 2px 10px rgba(139, 38, 62, 0.3);
}

.btn-primary:disabled {
  background-color: #333333;
  color: #666666;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #222222;
  color: #e5e5e5;
  border: 1px solid #3e3e3e;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #2a2a2a;
  border-color: #4e4e4e;
}

/* Loading & Empty states */
.loading-state, 
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #9ca3af;
}

.loading-state p, 
.empty-state p {
  font-style: italic;
  margin: 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3.5px solid rgba(255, 255, 255, 0.08);
  border-left-color: #c9a063;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Table styling for dark theme */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #2e2e2e;
  border-radius: 6px;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.projects-table th {
  background-color: #1c1c1c;
  border-bottom: 2px solid #2e2e2e;
  padding: 14px 18px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

.projects-table td {
  border-bottom: 1px solid #2e2e2e;
  padding: 16px 18px;
  font-size: 0.92rem;
  vertical-align: middle;
}

.projects-table tbody tr:last-child td {
  border-bottom: none;
}

.projects-table tbody tr:hover td {
  background-color: #262626;
}

.col-title {
  color: #ffffff;
  font-weight: 600;
}

.col-desc {
  color: #9ca3af;
  font-style: italic; /* Helper text italicized */
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-header {
  text-align: right;
}

.col-actions {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Table edit/delete buttons */
.btn-action {
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action.edit {
  background-color: #222222;
  color: #e5e5e5;
  border: 1px solid #3e3e3e;
}

.btn-action.edit:hover {
  background-color: #2a2a2a;
  border-color: #c9a063;
}

.btn-action.delete {
  background-color: rgba(239, 68, 68, 0.06);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.15);
}

.btn-action.delete:hover {
  background-color: #ef4444;
  color: #ffffff;
  border-color: #ef4444;
}

/* Passport Manager Card Elements */
.passport-manager-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.passport-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.preview-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 12px;
  align-self: flex-start;
}

.passport-preview-frame {
  max-width: 240px;
  border-radius: 8px;
  border: 2px dashed #3e3e3e;
  padding: 10px;
  background-color: #161616;
  display: flex;
  justify-content: center;
  align-items: center;
}

.passport-preview-img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}

.preview-source {
  font-size: 0.8rem;
  color: #c9a063;
  margin-top: 10px;
  font-style: italic;
}

.passport-controls-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid #2e2e2e;
  padding-top: 20px;
}

.file-input-hidden {
  display: none;
}

.upload-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  cursor: pointer;
  background-color: #222222;
  border: 1px solid #c9a063;
  border-radius: 6px;
  color: #e5e5e5;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.upload-label:hover {
  background-color: #2a2a2a;
  border-color: #8b263e;
}

.passport-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.download-template-btn {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #222222;
  border: 1px solid #3e3e3e;
  color: #e5e5e5;
  padding: 11px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.download-template-btn:hover {
  background-color: #2a2a2a;
  border-color: #4e4e4e;
}

.btn-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  margin-right: 8px;
}

.btn-reset-photo {
  padding: 11px 20px !important;
  font-size: 0.92rem !important;
}
</style>
