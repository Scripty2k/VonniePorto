<template>
  <div class="dashboard-layout" :class="{ 'sidebar-open': sidebarOpen, 'light-theme': !isDarkMode }">
    <!-- Backdrop Overlay for Mobile -->
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="closeSidebar"></div>

    <!-- Supabase-style Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo-area">
          <span class="logo-icon">✦</span>
          <span class="logo-text">Vonnie Admin Panel</span>
        </div>
        <div>
          <span class="description-text">{{ welcomeText }}</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          @click="currentTab = 'tarot'; closeSidebar()" 
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
          @click="currentTab = 'partners'; closeSidebar()" 
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
          @click="currentTab = 'socials'; closeSidebar()" 
          :class="['nav-item', { active: currentTab === 'socials' }]"
        >
          <!-- Socials/Share SVG Icon -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Socials</span>
        </button>

        <button 
          @click="currentTab = 'profile'; closeSidebar()" 
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
        <!-- Pretty segmented toggle control for light/dark mode -->
        <div class="theme-toggle-container">
          <button 
            type="button"
            @click="isDarkMode = false" 
            :class="['theme-toggle-btn-half', { active: !isDarkMode }]"
            aria-label="Light Mode"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span>Light</span>
          </button>
          <button 
            type="button"
            @click="isDarkMode = true" 
            :class="['theme-toggle-btn-half', { active: isDarkMode }]"
            aria-label="Dark Mode"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>Dark</span>
          </button>
          <div class="theme-toggle-slider" :class="{ 'is-dark': isDarkMode }"></div>
        </div>

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
      <!-- Mobile header top bar -->
      <div class="mobile-top-bar">
        <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="Toggle Menu">
          <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="mobile-logo-area">
          <span class="logo-icon">✦</span>
          <span class="logo-text">Staff Admin</span>
        </div>
      </div>

      <header class="content-header">
        <h1 class="content-title">
          <span v-if="currentTab === 'tarot'">Tarot Cards Deck</span>
          <span v-else-if="currentTab === 'partners'">Partners & Collaborators</span>
          <span v-else-if="currentTab === 'socials'">Social Links</span>
          <span v-else-if="currentTab === 'profile'">Profile Info (About Me)</span>
        </h1>
        <p class="content-subtitle">
          <span v-if="currentTab === 'tarot'">Configure the dynamic portfolio entries for cards of fate.</span>
          <span v-else-if="currentTab === 'partners'">Manage partner names for the homepage marquee.</span>
          <span v-else-if="currentTab === 'socials'">Manage social media links that appear in the Contact section.</span>
          <span v-else-if="currentTab === 'profile'">Edit your bio, professional tags, greeting, and replace or download the passport photo template.</span>
        </p>
      </header>

      <main class="content-body">
        
        <!-- ================= TAROT CARDS TAB ================= -->
        <template v-if="currentTab === 'tarot'">
          <!-- Basic fields + list grid -->
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

                <!-- Custom Card Back Image -->
                <div class="form-group">
                  <label>Custom Card Back (Optional)</label>
                  <p class="section-hint" style="margin: 0 0 8px 0; font-size: 0.8rem;">Upload a custom image for this card's back. If empty, a random default card design is used.</p>
                  <div v-if="projectForm.card_back_image" class="card-back-preview">
                    <img :src="projectForm.card_back_image" alt="Custom card back" class="card-back-preview-img" />
                    <button type="button" @click="removeCardBackImage" class="btn-action delete" style="margin-top: 8px;">Remove Custom Card</button>
                  </div>
                  <label v-else class="btn-secondary upload-label">
                    <input
                      type="file"
                      @change="handleCardBackUpload"
                      accept="image/*"
                      class="file-input-hidden"
                    />
                    Upload Card Back Image
                  </label>
                  <small class="help-text">JPEG/PNG, up to 20MB. Recommended size: 250×416px.</small>
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

          <!-- ✦ Rich Text Editor Section (full-width) -->
          <section class="popup-section">
            <div class="section-card">
              <h2 class="section-title">✦ Card Detail — Rich Text Content</h2>
              <p class="section-hint">This appears in the popup when visitors click the card. {{ editingProject ? '(Editing: ' + editingProject.title + ')' : 'Select a card above to edit its content.' }}</p>
              <div id="tarot-quill-editor" class="quill-editor-wrapper"></div>
              <div class="form-actions" style="margin-top: 18px;">
                <button type="button" @click="saveTarotRichContent" :disabled="submittingProject" class="btn-primary">
                  {{ submittingProject ? 'Saving...' : 'Save Rich Text' }}
                </button>
              </div>
            </div>
          </section>

          <!-- ✦ Card Gallery Images Section (full-width) -->
          <section class="popup-section">
            <div class="section-card">
              <h2 class="section-title">✦ Card Detail — Gallery Photos</h2>
              <p class="section-hint">Photos appear rotated left & right beside the text in the popup. {{ editingProject ? '(Editing: ' + editingProject.title + ')' : 'Select a card to manage its photos.' }}</p>

              <div class="form-group">
                <label class="btn-secondary upload-label">
                  <input
                    type="file"
                    @change="handleProjectImageUpload"
                    accept="image/*"
                    multiple
                    class="file-input-hidden"
                  />
                  + Add Photos (Multiple)
                </label>
                <small class="help-text">JPEG/PNG, up to 20MB each.</small>
              </div>

              <div v-if="projectForm.project_images && projectForm.project_images.length > 0" class="popup-gallery-grid" style="margin-top: 16px;">
                <div
                  v-for="(img, idx) in projectForm.project_images"
                  :key="idx"
                  class="popup-gallery-item"
                >
                  <img :src="img" :alt="'Card photo ' + (idx + 1)" />
                  <button
                    type="button"
                    @click="removeProjectImage(idx)"
                    class="gallery-item-remove"
                    aria-label="Remove photo"
                  >&times;</button>
                  <span class="gallery-item-badge">{{ idx % 2 === 0 ? 'Left' : 'Right' }}</span>
                </div>
              </div>
              <div v-else class="empty-state"><p>No photos yet for this card.</p></div>

              <div class="form-actions" style="margin-top: 18px;">
                <button type="button" @click="saveTarotImages" :disabled="submittingProject" class="btn-primary">
                  {{ submittingProject ? 'Saving...' : 'Save Gallery' }}
                </button>
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

        <!-- ================= SOCIALS TAB ================= -->
        <template v-else-if="currentTab === 'socials'">
          <!-- Social Link Form (Add/Edit) -->
          <section class="form-section">
            <div class="section-card">
              <h2 class="section-title">{{ editingSocial ? 'Edit Social Link' : 'Add New Social Link' }}</h2>
              <form @submit.prevent="saveSocial" class="project-form">
                <div class="form-group">
                  <label for="social-platform">Platform Name</label>
                  <input 
                    type="text" 
                    id="social-platform" 
                    v-model="socialForm.platform" 
                    required 
                    placeholder="e.g. Instagram, LinkedIn, Twitter"
                  />
                </div>

                <div class="form-group">
                  <label for="social-url">URL</label>
                  <input 
                    type="url" 
                    id="social-url" 
                    v-model="socialForm.url" 
                    required 
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>

                <div class="form-group">
                  <label for="social-icon">Decorative Icon</label>
                  <input 
                    type="text" 
                    id="social-icon" 
                    v-model="socialForm.icon" 
                    placeholder="♡ ◈ ✦ ★ ✿ ♪"
                  />
                  <small class="help-text">A single character or emoji displayed beside the platform name. E.g. ♡ for Instagram.</small>
                </div>

                <div class="form-group">
                  <label for="social-order">Sort Order</label>
                  <input 
                    type="number" 
                    id="social-order" 
                    v-model.number="socialForm.sort_order" 
                    placeholder="0"
                  />
                  <small class="help-text">Lower numbers appear first in the contact section.</small>
                </div>

                <div v-if="notification" :class="['notification-banner', notification.type]">
                  {{ notification.text }}
                </div>

                <div class="form-actions">
                  <button type="submit" :disabled="submittingSocial" class="btn-primary">
                    {{ submittingSocial ? 'Saving...' : (editingSocial ? 'Update Social' : 'Add Social') }}
                  </button>
                  <button 
                    type="button" 
                    v-if="editingSocial" 
                    @click="cancelEditSocial" 
                    class="btn-cancel"
                  >
                    Cancel Edit
                  </button>
                </div>
              </form>
            </div>
          </section>

          <!-- Socials List -->
          <section class="list-section">
            <div class="section-card">
              <h2 class="section-title">Active Social Links ({{ socials.length }})</h2>
              
              <div v-if="loadingSocials" class="loading-state">
                <div class="spinner"></div>
                <p>Fetching social links...</p>
              </div>

              <div v-else-if="socials.length === 0" class="empty-state">
                <p>No social links added yet. Create one on the left!</p>
              </div>

              <div v-else class="table-wrapper">
                <table class="projects-table">
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Platform</th>
                      <th>URL</th>
                      <th>Order</th>
                      <th class="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="social in socials" :key="social.id">
                      <td class="col-icon">{{ social.icon || '✦' }}</td>
                      <td class="col-title"><strong>{{ social.platform }}</strong></td>
                      <td class="col-desc">
                        <a :href="social.url" target="_blank" rel="noopener noreferrer" class="table-link">{{ social.url }}</a>
                      </td>
                      <td class="col-order">{{ social.sort_order }}</td>
                      <td class="col-actions">
                        <button @click="startEditSocial(social)" class="btn-action edit">Edit</button>
                        <button @click="deleteSocial(social.id)" class="btn-action delete">Delete</button>
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
                  <label>Passport Stamps / Skills</label>
                  <p class="section-hint" style="margin: 0 0 12px 0; font-size: 0.82rem; color: #a0a0a0;">Add skills or badges that appear as travel stamps in the About Me section. For each skill, choose an authentic stamp template design.</p>
                  
                  <div class="admin-stamps-list">
                    <div v-for="(tagItem, idx) in profileTagsList" :key="idx" class="admin-stamp-item">
                      <input 
                        type="text" 
                        v-model="tagItem.text" 
                        placeholder="Tag text (e.g. Design)" 
                        class="admin-stamp-input"
                        required
                      />
                      
                      <select v-model="tagItem.stamp" class="admin-stamp-select">
                        <option value="">Auto (Sequential)</option>
                        <option value="circle">Circle (Ink Blue)</option>
                        <option value="hexagon">Hexagon (Red Ink)</option>
                        <option value="triangle">Triangle (Emerald Green)</option>
                        <option value="double-rect">Double Rectangle (Orange/Rust)</option>
                        <option value="oval">Oval (Vintage Navy)</option>
                        <option value="scallop-rect">Scalloped Rectangle (Pink/Magenta)</option>
                      </select>
                      
                      <button type="button" @click="removeAdminTag(idx)" class="btn-action delete btn-remove-tag">
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <button type="button" @click="addAdminTag" class="btn-secondary" style="margin-top: 12px;">
                    + Add New Stamp / Tag
                  </button>
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
                    <small class="help-text">JPEG/PNG formatted file, maximum size 20MB</small>
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
          <!-- About Popup Content Section -->
          <section class="list-section popup-section">
            <div class="section-card">
              <h2 class="section-title">✦ About Popup — Rich Text Content</h2>
              <p class="section-hint">This content appears in the full-screen popup when visitors click the passport.</p>

              <div v-if="loadingProfile" class="loading-state">
                <div class="spinner"></div>
                <p>Loading content...</p>
              </div>

              <div v-else class="popup-editor-area">
                <div id="popup-quill-editor" class="quill-editor-wrapper"></div>

                <div class="form-actions" style="margin-top: 18px;">
                  <button type="button" @click="savePopupContent" :disabled="savingPopup" class="btn-primary">
                    {{ savingPopup ? 'Saving...' : 'Save Rich Text' }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- About Popup — Gallery Images Section -->
          <section class="list-section popup-section">
            <div class="section-card">
              <h2 class="section-title">✦ About Popup — Gallery Photos</h2>
              <p class="section-hint">Upload multiple pictures. They'll appear rotated on the left and right sides of the popup text.</p>

              <div v-if="loadingProfile" class="loading-state">
                <div class="spinner"></div>
                <p>Loading gallery...</p>
              </div>

              <div v-else class="popup-gallery-area">
                <!-- Upload area -->
                <div class="form-group">
                  <label class="btn-secondary upload-label">
                    <input
                      type="file"
                      @change="handlePopupImageUpload"
                      accept="image/*"
                      multiple
                      class="file-input-hidden"
                    />
                    + Add Photos (Multiple)
                  </label>
                  <small class="help-text">JPEG/PNG, up to 20MB each. Images alternate left/right in the popup.</small>
                </div>

                <!-- Gallery preview grid -->
                <div v-if="profileForm.popup_images && profileForm.popup_images.length > 0" class="popup-gallery-grid">
                  <div
                    v-for="(img, idx) in profileForm.popup_images"
                    :key="idx"
                    class="popup-gallery-item"
                  >
                    <img :src="img" :alt="'Gallery photo ' + (idx + 1)" />
                    <button
                      type="button"
                      @click="removePopupImage(idx)"
                      class="gallery-item-remove"
                      aria-label="Remove photo"
                    >×</button>
                    <span class="gallery-item-badge">{{ idx % 2 === 0 ? 'Left' : 'Right' }}</span>
                  </div>
                </div>

                <div v-else class="empty-state">
                  <p>No gallery photos yet. Upload some above!</p>
                </div>

                <div class="form-actions" style="margin-top: 18px;">
                  <button type="button" @click="savePopupImages" :disabled="savingPopup" class="btn-primary">
                    {{ savingPopup ? 'Saving...' : 'Save Gallery' }}
                  </button>
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { account, databases, storage, DATABASE_ID, BUCKET_ID, COLLECTIONS } from '../appwrite.js'
import { ID, Query } from 'appwrite'
import passportTemplate from '../assets/images/passport.png'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import BlotFormatter from '@enzedonline/quill-blot-formatter2'
import '@enzedonline/quill-blot-formatter2/dist/css/quill-blot-formatter2.css'

const BaseImageFormat = Quill.import('formats/image');
class CustomImageFormat extends BaseImageFormat {
  static formats(domNode) {
    const formats = super.formats(domNode) || {};
    if (domNode.hasAttribute('style')) {
      formats.style = domNode.getAttribute('style');
    }
    if (domNode.hasAttribute('width')) {
      formats.width = domNode.getAttribute('width');
    }
    if (domNode.hasAttribute('height')) {
      formats.height = domNode.getAttribute('height');
    }
    return formats;
  }

  format(name, value) {
    if (['style', 'width', 'height'].includes(name)) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register(CustomImageFormat, true);
Quill.register('modules/blotFormatter', BlotFormatter);

// Register font sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
Quill.register(Size, true);

const phrases = [
  "Hello vonneh :3",
  "HAIIII",
  "Oh vonneh",
  "jip broah eh eh",
  "mornin vonneh",
  "VONNEHHH",
];

const welcomeText = ref('Hello vonneh :3');

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  welcomeText.value = phrases[randomIndex];
});

const router = useRouter()
const currentTab = ref('tarot')
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Light / Dark Theme Mode
const isDarkMode = ref(localStorage.getItem('admin-theme') !== 'light')
watch(isDarkMode, (newVal) => {
  localStorage.setItem('admin-theme', newVal ? 'dark' : 'light')
})

// Tarot Card States
const projects = ref([])
const loadingProjects = ref(true)
const submittingProject = ref(false)
const editingProject = ref(null)
const projectForm = ref({
  title: '',
  description: '',
  detailed_content: '',
  detailed_content_html: '',
  project_images: [],
  link_url: '',
  card_back_image: null
})

// Partners States
const partners = ref([])
const loadingPartners = ref(true)
const submittingPartner = ref(false)
const editingPartner = ref(null)
const partnerForm = ref({
  name: ''
})

// Socials States
const socials = ref([])
const loadingSocials = ref(true)
const submittingSocial = ref(false)
const editingSocial = ref(null)
const socialForm = ref({
  platform: '',
  url: '',
  icon: '✦',
  sort_order: 0
})

// Profile / Info States
const profileForm = ref({
  greeting: '',
  name: '',
  pronunciation: '',
  bio: '',
  passport_image: null,
  popup_content: '',
  popup_images: []
})
const loadingProfile = ref(true)
const savingProfile = ref(false)
const savingPopup = ref(false)
const profileTagsList = ref([])

// Quill editor instances
let quillEditor = null       // profile popup editor
let tarotQuillEditor = null  // tarot card editor

// Upload helper: uploads to Appwrite Storage and returns download/view URL
const uploadFileToStorage = async (file, folder) => {
  const response = await storage.createFile(BUCKET_ID, ID.unique(), file)
  const fileUrl = storage.getFileView(BUCKET_ID, response.$id)
  return fileUrl.href
}

// Upload a file to Firebase Storage (wrapper for Quill editor compatibility)
const uploadImageToStorage = async (file) => {
  return await uploadFileToStorage(file, 'quill-media')
}

// Image handler: uploads to Firebase Storage so GIFs (and all images) are
// served as real files — avoiding base64 bloat.
const makeImageHandler = (quillInstance) => () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*,image/gif')
  input.click()
  input.onchange = async () => {
    const file = input.files[0]
    if (!file) return

    // Try Firebase Storage first
    try {
      const url = await uploadImageToStorage(file)
      const range = quillInstance.getSelection(true)
      quillInstance.insertEmbed(range.index, 'image', url, 'user')
      quillInstance.setSelection(range.index + 1, 0)
    } catch (err) {
      console.warn('Appwrite Storage upload failed, falling back to data URL:', err.message)
      // Fallback: embed as data URL (works for small images)
      const reader = new FileReader()
      reader.onload = (e) => {
        const range = quillInstance.getSelection(true)
        quillInstance.insertEmbed(range.index, 'image', e.target.result, 'user')
        quillInstance.setSelection(range.index + 1, 0)
      }
      reader.readAsDataURL(file)
    }
  }
}

// Helper: convert any YouTube URL to an embed URL
const convertToYouTubeEmbed = (url) => {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url
  let match = url.match(/[?&]v=([^&]+)/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  match = url.match(/youtu\.be\/([^?]+)/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

// Initialize profile Quill editor
const initQuill = async () => {
  await nextTick()
  const el = document.getElementById('popup-quill-editor')
  if (!el) return

  if (quillEditor && document.body.contains(quillEditor.root)) {
    if (profileForm.value.popup_content) {
      quillEditor.root.innerHTML = profileForm.value.popup_content
    }
    return
  }

  el.innerHTML = ''

  const siblingToolbars = el.parentNode.querySelectorAll('.ql-toolbar')
  siblingToolbars.forEach(tb => tb.remove())

  quillEditor = new Quill(el, {
    theme: 'snow',
    placeholder: 'Write something beautiful about yourself...',
    modules: {
      toolbar: [
        [{ size: ['10px', '12px', '14px', false, '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'] }],
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote'],
        ['image', 'video'],
        ['clean']
      ],
      blotFormatter: {}
    }
  })

  const popupToolbar = quillEditor.getModule('toolbar')
  popupToolbar.addHandler('image', makeImageHandler(quillEditor))

  popupToolbar.addHandler('video', () => {
    const url = prompt('Paste a YouTube video URL:')
    const embedUrl = convertToYouTubeEmbed(url)
    if (embedUrl) {
      const range = quillEditor.getSelection(true)
      quillEditor.insertEmbed(range.index, 'video', embedUrl, 'user')
      quillEditor.setSelection(range.index + 1, 0)
    }
  })

  if (profileForm.value.popup_content) {
    quillEditor.root.innerHTML = profileForm.value.popup_content
  }
}

// Initialize tarot card Quill editor
const initTarotQuill = async () => {
  await nextTick()
  const el = document.getElementById('tarot-quill-editor')
  if (!el) return

  if (tarotQuillEditor && document.body.contains(tarotQuillEditor.root)) {
    tarotQuillEditor.root.innerHTML = projectForm.value.detailed_content_html || ''
    return
  }

  el.innerHTML = ''

  const siblingToolbars = el.parentNode.querySelectorAll('.ql-toolbar')
  siblingToolbars.forEach(tb => tb.remove())

  tarotQuillEditor = new Quill(el, {
    theme: 'snow',
    placeholder: 'Describe this project — process, tools, story...',
    modules: {
      toolbar: [
        [{ size: ['10px', '12px', '14px', false, '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'] }],
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote'],
        ['image', 'video'],
        ['clean']
      ],
      blotFormatter: {}
    }
  })

  const tarotToolbar = tarotQuillEditor.getModule('toolbar')
  tarotToolbar.addHandler('image', makeImageHandler(tarotQuillEditor))

  tarotToolbar.addHandler('video', () => {
    const url = prompt('Paste a YouTube video URL:')
    const embedUrl = convertToYouTubeEmbed(url)
    if (embedUrl) {
      const range = tarotQuillEditor.getSelection(true)
      tarotQuillEditor.insertEmbed(range.index, 'video', embedUrl, 'user')
      tarotQuillEditor.setSelection(range.index + 1, 0)
    }
  })

  if (projectForm.value.detailed_content_html) {
    tarotQuillEditor.root.innerHTML = projectForm.value.detailed_content_html
  }
}

watch(
  () => currentTab.value,
  async (tab) => {
    if (tab === 'profile') {
      tarotQuillEditor = null
      if (!loadingProfile.value) {
        initQuill()
      }
    } else if (tab === 'tarot') {
      quillEditor = null
      await nextTick()
      initTarotQuill()
    } else {
      quillEditor = null
      tarotQuillEditor = null
    }
  }
)

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
    console.error('Error loading projects:', err)
    showNotification('Failed to load projects: ' + err.message, 'error')
  } finally {
    loadingProjects.value = false
  }
}

const saveProject = async () => {
  submittingProject.value = true
  try {
    const payload = {
      title: projectForm.value.title,
      description: projectForm.value.description,
      detailed_content: projectForm.value.detailed_content,
      link_url: projectForm.value.link_url,
      card_back_image: projectForm.value.card_back_image || null,
      updated_at: new Date().toISOString()
    }
    
    if (editingProject.value) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROJECTS, editingProject.value.id, payload)
      showNotification('Tarot card updated successfully!')
      cancelEditProject()
    } else {
      payload.created_at = new Date().toISOString()
      payload.project_images = []
      payload.detailed_content_html = ''
      await databases.createDocument(DATABASE_ID, COLLECTIONS.PROJECTS, ID.unique(), payload)
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

const saveTarotRichContent = async () => {
  if (!tarotQuillEditor || !editingProject.value) {
    showNotification('Please select a card from the table above first.', 'error')
    return
  }
  submittingProject.value = true
  try {
    const html = tarotQuillEditor.root.innerHTML
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROJECTS, editingProject.value.id, {
      detailed_content_html: html
    })
    projectForm.value.detailed_content_html = html
    showNotification('Card content saved!')
    await fetchProjects()
  } catch (err) {
    console.error('Error saving card content:', err)
    showNotification('Failed to save: ' + err.message, 'error')
  } finally {
    submittingProject.value = false
  }
}

const saveTarotImages = async () => {
  if (!editingProject.value) {
    showNotification('Please select a card from the table above first.', 'error')
    return
  }
  submittingProject.value = true
  try {
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROJECTS, editingProject.value.id, {
      project_images: projectForm.value.project_images
    })
    showNotification('Gallery saved!')
    await fetchProjects()
  } catch (err) {
    console.error('Error saving images:', err)
    showNotification('Failed to save gallery: ' + err.message, 'error')
  } finally {
    submittingProject.value = false
  }
}

const handleProjectImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const maxSize = 20 * 1024 * 1024
  const validFiles = files.filter(f => {
    if (f.size > maxSize) {
      showNotification(`"${f.name}" exceeds 20MB and was skipped.`, 'error')
      return false
    }
    return true
  })

  if (!validFiles.length) return

  showNotification(`Uploading ${validFiles.length} photo(s)...`, 'info')
  submittingProject.value = true
  try {
    for (const file of validFiles) {
      const url = await uploadFileToStorage(file, 'projects')
      if (!projectForm.value.project_images) projectForm.value.project_images = []
      projectForm.value.project_images.push(url)
    }
    showNotification(`${validFiles.length} photo(s) uploaded. Click "Save Gallery" to apply!`)
  } catch (err) {
    console.error('Error uploading project images:', err)
    showNotification('Failed to upload: ' + err.message, 'error')
  } finally {
    submittingProject.value = false
    event.target.value = ''
  }
}

const removeProjectImage = (idx) => {
  projectForm.value.project_images.splice(idx, 1)
}

const startEditProject = async (project) => {
  editingProject.value = project
  projectForm.value = {
    title: project.title,
    description: project.description || '',
    detailed_content: project.detailed_content || '',
    detailed_content_html: project.detailed_content_html || '',
    project_images: project.project_images || [],
    link_url: project.link_url || '',
    card_back_image: project.card_back_image || null
  }
  await nextTick()
  initTarotQuill()
}

const cancelEditProject = () => {
  editingProject.value = null
  resetProjectForm()
  if (tarotQuillEditor) {
    tarotQuillEditor.root.innerHTML = ''
  }
}

const resetProjectForm = () => {
  projectForm.value = {
    title: '',
    description: '',
    detailed_content: '',
    detailed_content_html: '',
    project_images: [],
    link_url: '',
    card_back_image: null
  }
}

const handleCardBackUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 20 * 1024 * 1024) {
    showNotification('Card back image must be smaller than 20MB', 'error')
    return
  }

  submittingProject.value = true
  try {
    showNotification('Uploading card back...', 'info')
    const url = await uploadFileToStorage(file, 'card-backs')
    projectForm.value.card_back_image = url
    showNotification('Custom card back uploaded! Click "Deal Card" or "Update Card" to apply.', 'success')
  } catch (err) {
    console.error('Error uploading card back:', err)
    showNotification('Upload failed: ' + err.message, 'error')
  } finally {
    submittingProject.value = false
    event.target.value = ''
  }
}

const removeCardBackImage = () => {
  projectForm.value.card_back_image = null
  showNotification('Custom card back removed. A random default card will be used.', 'success')
}

const deleteProject = async (id) => {
  if (!confirm('Are you sure you want to return this card to the deck (delete)?')) return

  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id)
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
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PARTNERS,
      [Query.orderDesc('created_at')]
    )
    partners.value = response.documents.map(doc => ({
      id: doc.$id,
      ...doc
    }))
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
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.PARTNERS, editingPartner.value.id, {
        name: partnerForm.value.name.trim()
      })
      showNotification('Partner updated successfully!')
      cancelEditPartner()
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.PARTNERS, ID.unique(), {
        name: partnerForm.value.name.trim(),
        created_at: new Date().toISOString()
      })
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
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PARTNERS, id)
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

// ================= SOCIALS CRUD =================

const fetchSocials = async () => {
  loadingSocials.value = true
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SOCIALS,
      [Query.orderAsc('sort_order')]
    )
    socials.value = response.documents.map(doc => ({
      id: doc.$id,
      ...doc
    }))
  } catch (err) {
    console.error('Error loading socials:', err)
    showNotification('Failed to load socials: ' + err.message, 'error')
  } finally {
    loadingSocials.value = false
  }
}

const saveSocial = async () => {
  if (!socialForm.value.platform.trim() || !socialForm.value.url.trim()) return
  submittingSocial.value = true
  try {
    const payload = {
      platform: socialForm.value.platform.trim(),
      url: socialForm.value.url.trim(),
      icon: socialForm.value.icon.trim() || '✦',
      sort_order: Number(socialForm.value.sort_order) || 0
    }
    if (editingSocial.value) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.SOCIALS, editingSocial.value.id, payload)
      showNotification('Social link updated successfully!')
      cancelEditSocial()
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.SOCIALS, ID.unique(), payload)
      showNotification('Social link added successfully!')
      resetSocialForm()
    }
    await fetchSocials()
  } catch (err) {
    console.error('Error saving social:', err)
    showNotification('Failed to save social: ' + err.message, 'error')
  } finally {
    submittingSocial.value = false
  }
}

const startEditSocial = (social) => {
  editingSocial.value = social
  socialForm.value = {
    platform: social.platform,
    url: social.url,
    icon: social.icon || '✦',
    sort_order: social.sort_order || 0
  }
}

const cancelEditSocial = () => {
  editingSocial.value = null
  resetSocialForm()
}

const resetSocialForm = () => {
  socialForm.value = {
    platform: '',
    url: '',
    icon: '✦',
    sort_order: 0
  }
}

const deleteSocial = async (id) => {
  if (!confirm('Are you sure you want to delete this social link?')) return

  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SOCIALS, id)
    showNotification('Social link deleted.')
    if (editingSocial.value && editingSocial.value.id === id) {
      cancelEditSocial()
    }
    await fetchSocials()
  } catch (err) {
    console.error('Error deleting social:', err)
    showNotification('Failed to delete social: ' + err.message, 'error')
  }
}

// ================= PROFILE INFO FUNCTIONS =================

const fetchProfile = async () => {
  loadingProfile.value = true
  try {
    const data = await databases.getDocument(DATABASE_ID, COLLECTIONS.PROFILE, '1')
    profileForm.value = {
      greeting: data.greeting || '',
      name: data.name || '',
      pronunciation: data.pronunciation || '',
      bio: data.bio || '',
      passport_image: data.passport_image || null,
      popup_content: data.popup_content || '',
      popup_images: data.popup_images || []
    }
    
    profileTagsList.value = []
    if (data.tags) {
      profileTagsList.value = data.tags.map(tStr => {
        const parts = tStr.split(':')
        return {
          text: parts[0],
          stamp: parts[1] || ''
        }
      })
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    if (err.code === 404) {
      try {
        const defaultProfile = {
          greeting: 'Hi, my name is',
          name: 'Siobhan Moors.',
          pronunciation: 'pronounced [Shuh-vohn]',
          bio: 'A short bio blurb about yourself goes here. Talk about your passion, what drives your creative work, and what makes you uniquely you.',
          passport_image: null,
          popup_content: '',
          popup_images: [],
          tags: ['Design:hexagon', 'Dev:triangle', 'Creative:oval']
        }
        await databases.createDocument(DATABASE_ID, COLLECTIONS.PROFILE, '1', defaultProfile)
        
        profileForm.value = { ...defaultProfile }
        profileTagsList.value = [
          { text: 'Design', stamp: 'hexagon' },
          { text: 'Dev', stamp: 'triangle' },
          { text: 'Creative', stamp: 'oval' }
        ]
      } catch (createErr) {
        console.error('Error creating default profile:', createErr)
        showNotification('Failed to initialize profile: ' + createErr.message, 'error')
      }
    } else {
      showNotification('Failed to load profile settings: ' + err.message, 'error')
    }
  } finally {
    loadingProfile.value = false
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    const tagsArray = profileTagsList.value
      .filter(t => t.text && t.text.trim())
      .map(t => `${t.text.trim()}:${t.stamp}`)

    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROFILE, '1', {
      greeting: profileForm.value.greeting,
      name: profileForm.value.name,
      pronunciation: profileForm.value.pronunciation,
      bio: profileForm.value.bio,
      tags: tagsArray,
      passport_image: profileForm.value.passport_image
    })

    showNotification('Profile updated successfully!')
    await fetchProfile()
  } catch (err) {
    console.error('Error saving profile:', err)
    showNotification('Failed to save profile: ' + err.message, 'error')
  } finally {
    savingProfile.value = false
  }
}

const addAdminTag = () => {
  profileTagsList.value.push({ text: '', stamp: '' })
}

const removeAdminTag = (idx) => {
  profileTagsList.value.splice(idx, 1)
}

const savePopupContent = async () => {
  if (!quillEditor) return
  savingPopup.value = true
  try {
    const html = quillEditor.root.innerHTML
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROFILE, '1', {
      popup_content: html
    })
    profileForm.value.popup_content = html
    showNotification('Popup text saved!')
  } catch (err) {
    console.error('Error saving popup content:', err)
    showNotification('Failed to save popup content: ' + err.message, 'error')
  } finally {
    savingPopup.value = false
  }
}

const savePopupImages = async () => {
  savingPopup.value = true
  try {
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROFILE, '1', {
      popup_images: profileForm.value.popup_images
    })
    showNotification('Gallery saved!')
  } catch (err) {
    console.error('Error saving popup images:', err)
    showNotification('Failed to save gallery: ' + err.message, 'error')
  } finally {
    savingPopup.value = false
  }
}

const handlePopupImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const maxSize = 20 * 1024 * 1024
  const validFiles = files.filter(f => {
    if (f.size > maxSize) {
      showNotification(`"${f.name}" exceeds 20MB and was skipped.`, 'error')
      return false
    }
    return true
  })

  if (!validFiles.length) return

  savingPopup.value = true
  try {
    showNotification(`Uploading ${validFiles.length} photo(s)...`, 'info')
    for (const file of validFiles) {
      const url = await uploadFileToStorage(file, 'profile-popup')
      if (!profileForm.value.popup_images) profileForm.value.popup_images = []
      profileForm.value.popup_images.push(url)
    }
    showNotification(`${validFiles.length} photo(s) uploaded. Click "Save Gallery" to apply!`)
  } catch (err) {
    console.error('Error uploading popup images:', err)
    showNotification('Upload failed: ' + err.message, 'error')
  } finally {
    savingPopup.value = false
    event.target.value = ''
  }
}

const removePopupImage = (idx) => {
  profileForm.value.popup_images.splice(idx, 1)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 20 * 1024 * 1024) {
    showNotification('Photo must be smaller than 20MB', 'error')
    return
  }

  savingProfile.value = true
  try {
    showNotification('Uploading profile photo...', 'info')
    const url = await uploadFileToStorage(file, 'profile')
    profileForm.value.passport_image = url
    showNotification('Photo uploaded. Click "Save Profile" to apply!', 'success')
  } catch (err) {
    console.error('Error uploading profile photo:', err)
    showNotification('Upload failed: ' + err.message, 'error')
  } finally {
    savingProfile.value = false
    event.target.value = ''
  }
}

const clearPassportImage = async () => {
  if (!confirm('Are you sure you want to revert to the default template photo?')) return
  profileForm.value.passport_image = null
  showNotification('Photo reset to default template. Click "Save Profile" to apply!', 'success')
}

const handleLogout = async () => {
  try {
    await account.deleteSession('current')
    router.push('/admin/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

onMounted(() => {
  fetchProjects()
  fetchPartners()
  fetchSocials()
  fetchProfile().then(() => {
    if (currentTab.value === 'profile') {
      initQuill()
    }
  })
})
</script>

<style scoped>
/* Main Layout & Default System Typography */
.dashboard-layout {
  /* Default Dark Mode Theme Custom Properties */
  --bg-layout: #1a1a1a;
  --bg-sidebar: #121212;
  --bg-header: #141414;
  --bg-card: #222222;
  --bg-input: #1a1a1a;
  --bg-input-focus: #1e1e1e;
  --border-color: #2e2e2e;
  --border-input: #3e3e3e;
  --text-main: #e5e5e5;
  --text-title: #ffffff;
  --text-muted: #9ca3af;
  --text-hint: #6b7280;
  --bg-nav-active: #242424;
  --bg-nav-hover: rgba(255, 255, 255, 0.04);
  --border-nav-active: #333333;
  --table-hover: #262626;
  --quill-editor-bg: #1a1a1a;
  --quill-toolbar-bg: #1e1e1e;
  --spinner-bg: rgba(255, 255, 255, 0.08);
  --passport-frame-bg: #161616;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  --color-logout: #fca5a5;
  --color-logout-hover: #f87171;
  --bg-logout-hover: rgba(239, 68, 68, 0.08);
  --accent-focus-shadow: rgba(201, 160, 99, 0.15);
  --color-accent: #c9a063;
  --color-accent-hover: #e5c88e;
  --bg-cancel: #222222;
  --bg-cancel-hover: #2a2a2a;
  --border-cancel: #3e3e3e;
  --color-primary: #8b263e;
  --color-primary-hover: #a72f4c;

  display: flex;
  min-height: 100vh;
  background-color: var(--bg-layout);
  color: var(--text-main);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Light Theme overrides */
.dashboard-layout.light-theme {
  --bg-layout: #f4f5f6;
  --bg-sidebar: #ffffff;
  --bg-header: #fafafa;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --bg-input-focus: #ffffff;
  --border-color: #e2e8f0;
  --border-input: #cbd5e1;
  --text-main: #334155;
  --text-title: #0f172a;
  --text-muted: #64748b;
  --text-hint: #94a3b8;
  --bg-nav-active: #f1f5f9;
  --bg-nav-hover: rgba(15, 23, 42, 0.04);
  --border-nav-active: #e2e8f0;
  --table-hover: #f8fafc;
  --quill-editor-bg: #ffffff;
  --quill-toolbar-bg: #f8fafc;
  --spinner-bg: rgba(15, 23, 42, 0.08);
  --passport-frame-bg: #f8fafc;
  --card-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
  --color-logout: #ef4444;
  --color-logout-hover: #dc2626;
  --bg-logout-hover: rgba(239, 68, 68, 0.06);
  --accent-focus-shadow: rgba(201, 160, 99, 0.12);
  --color-accent: #b28a50; /* A slightly darker gold for high contrast & readability in light mode */
  --color-accent-hover: #916c39;
  --bg-cancel: #f1f5f9;
  --bg-cancel-hover: #e2e8f0;
  --border-cancel: #cbd5e1;
  --color-primary: #9d2d48; /* Slightly deeper burgundy for readability */
  --color-primary-hover: #b43855;
}

/* Smooth transitions for theme switching */
.dashboard-layout,
.dashboard-sidebar,
.dashboard-content,
.content-header,
.section-card,
.form-group input,
.form-group textarea,
.btn-primary,
.btn-cancel,
.nav-item,
.projects-table th,
.projects-table td,
.projects-table tr,
.quill-editor-wrapper,
.passport-preview-frame,
.card-back-preview,
.mobile-top-bar,
.theme-toggle-slider,
.theme-toggle-container,
.logo-area,
.logo-icon,
.description-text {
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Supabase-style Sidebar */
.dashboard-sidebar {
  width: 260px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-title);
  font-weight: 700;
  font-size: 1.1rem;
}

.logo-icon {
  color: var(--color-accent);
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
  color: var(--text-muted);
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
  color: var(--text-title);
  background-color: var(--bg-nav-hover);
}

.nav-item.active {
  color: var(--text-title);
  background-color: var(--bg-nav-active);
  border-color: var(--border-nav-active);
}

.nav-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 14px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-logout-sidebar {
  color: var(--color-logout);
}

.btn-logout-sidebar:hover {
  background-color: var(--bg-logout-hover);
  color: var(--color-logout-hover);
}

/* ===== THEME TOGGLE ELEMENT ===== */
.theme-toggle-container {
  position: relative;
  display: flex;
  background-color: var(--bg-layout);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 3px;
  margin-bottom: 8px;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.theme-toggle-btn-half {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 2;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  outline: none;
  border-radius: 6px;
  transition: color 0.3s ease;
}

.theme-toggle-btn-half.active {
  color: var(--text-title);
}

.theme-toggle-btn-half:hover:not(.active) {
  color: var(--text-title);
}

.theme-toggle-slider {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 3px);
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
}

.theme-toggle-slider.is-dark {
  transform: translateX(100%);
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
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-header);
}

.content-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-title);
  margin: 0 0 6px 0;
}

.content-subtitle {
  font-size: 0.88rem;
  color: var(--text-muted);
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
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 28px;
  box-shadow: var(--card-shadow);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-title);
  margin: 0 0 24px 0;
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-group input, 
.form-group textarea {
  padding: 11px 14px;
  border: 1px solid var(--border-input);
  border-radius: 6px;
  font-size: 0.92rem;
  background-color: var(--bg-input);
  color: var(--text-main);
  transition: all 0.2s ease;
}

.form-group input:focus, 
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  background-color: var(--bg-input-focus);
  box-shadow: 0 0 0 3px var(--accent-focus-shadow);
}

/* Helper small print */
.help-text {
  font-size: 0.76rem;
  color: var(--text-hint);
  margin-top: 2px;
  font-style: italic;
}

/* Placeholder font italic support */
.form-group input::placeholder, 
.form-group textarea::placeholder {
  font-style: italic;
  color: var(--text-hint);
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
  background-color: var(--color-primary);
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
  background-color: var(--color-primary-hover);
  box-shadow: 0 2px 10px rgba(139, 38, 62, 0.3);
}

.btn-primary:disabled {
  background-color: #333333;
  color: #666666;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: var(--bg-cancel);
  color: var(--text-main);
  border: 1px solid var(--border-cancel);
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: var(--bg-cancel-hover);
  border-color: var(--border-input);
}

/* Loading & Empty states */
.loading-state, 
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: var(--text-muted);
}

.loading-state p, 
.empty-state p {
  font-style: italic;
  margin: 0;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3.5px solid var(--spinner-bg);
  border-left-color: var(--color-accent);
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
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.projects-table th {
  background-color: var(--bg-header);
  border-bottom: 2px solid var(--border-color);
  padding: 14px 18px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.projects-table td {
  border-bottom: 1px solid var(--border-color);
  padding: 16px 18px;
  font-size: 0.92rem;
  vertical-align: middle;
}

.projects-table tbody tr:last-child td {
  border-bottom: none;
}

.projects-table tbody tr:hover td {
  background-color: var(--table-hover);
}

.col-title {
  color: var(--text-title);
  font-weight: 600;
}

.col-desc {
  color: var(--text-muted);
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
  background-color: var(--bg-cancel);
  color: var(--text-main);
  border: 1px solid var(--border-cancel);
}

.btn-action.edit:hover {
  background-color: var(--bg-cancel-hover);
  border-color: var(--color-accent);
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

.description-text {
  font-size: 20px;
  color: var(--text-muted);
  animation: rainbow-intro 2s ease-out forwards;
}

@keyframes rainbow-intro {
  0% {
    color: #ff6b6b;
  }
  25% {
    color: #feca57;
  }
  50% {
    color: #1dd1a1;
  }
  75% {
    color: #5f27cd;
  }
  100% {
    color: var(--text-muted);
  }
}

.preview-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
  align-self: flex-start;
}

.passport-preview-frame {
  max-width: 240px;
  border-radius: 8px;
  border: 2px dashed var(--border-input);
  padding: 10px;
  background-color: var(--passport-frame-bg);
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
  color: var(--color-accent);
  margin-top: 10px;
  font-style: italic;
}

.passport-controls-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid var(--border-color);
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
  background-color: var(--bg-cancel);
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.upload-label:hover {
  background-color: var(--bg-cancel-hover);
  border-color: var(--color-primary);
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
  background-color: var(--bg-cancel);
  border: 1px solid var(--border-cancel);
  color: var(--text-main);
  padding: 11px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.download-template-btn:hover {
  background-color: var(--bg-cancel-hover);
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

/* ===== CARD BACK PREVIEW ===== */
.card-back-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--passport-frame-bg);
  border: 1px dashed var(--border-input);
  border-radius: 8px;
}

.card-back-preview-img {
  width: 120px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* ===== POPUP CONTENT SECTIONS ===== */
.popup-section {
  /* These sections span the full content-body grid so they sit below the 2-col layout */
  grid-column: 1 / -1;
}

.section-hint {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-style: italic;
  margin: -12px 0 20px;
}

/* Quill editor override for dark dashboard */
.quill-editor-wrapper {
  background-color: var(--quill-editor-bg);
  border: 1px solid var(--border-input);
  border-radius: 6px;
  overflow: hidden;
  min-height: 260px;
}

/* Override Quill toolbar + editor for dark mode */
:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid var(--border-input);
  background: var(--quill-toolbar-bg);
  padding: 10px 12px;
}

:deep(.ql-toolbar.ql-snow .ql-stroke) {
  stroke: var(--text-muted);
}

:deep(.ql-toolbar.ql-snow .ql-fill) {
  fill: var(--text-muted);
}

:deep(.ql-toolbar.ql-snow .ql-picker-label) {
  color: var(--text-muted);
}

:deep(.ql-toolbar.ql-snow button:hover .ql-stroke),
:deep(.ql-toolbar.ql-snow button.ql-active .ql-stroke) {
  stroke: var(--color-accent);
}

:deep(.ql-toolbar.ql-snow .ql-picker-label:hover),
:deep(.ql-toolbar.ql-snow .ql-picker-label.ql-active) {
  color: var(--color-accent);
}

:deep(.ql-container.ql-snow) {
  border: none;
  font-family: 'Times New Roman', serif;
  font-size: 0.95rem;
  color: var(--text-main);
  min-height: 200px;
}

:deep(.ql-editor) {
  min-height: 200px;
  line-height: 1.75;
  color: var(--text-main);
  padding: 14px 16px;
}

:deep(.ql-editor.ql-blank::before) {
  color: var(--text-hint);
  font-style: italic;
}

/* Responsive embedded videos (YouTube iframes) */
:deep(.ql-video) {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 4px;
  margin: 12px 0;
}

/* Text alignment support */
:deep(.ql-align-center) { text-align: center; }
:deep(.ql-align-right)  { text-align: right; }
:deep(.ql-align-justify) { text-align: justify; }

/* Gallery grid */
.popup-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.popup-gallery-item {
  position: relative;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 6px;
  overflow: hidden;
}

.popup-gallery-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.gallery-item-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.85);
  color: #fff;
  border: none;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.gallery-item-remove:hover {
  background: #ef4444;
}

.gallery-item-badge {
  display: block;
  text-align: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-hint);
  padding: 4px 0;
}
/* Socials table styles */
.table-link {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.85rem;
  word-break: break-all;
  transition: color 0.2s ease;
}

.table-link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

.col-icon {
  font-size: 1.2rem;
  text-align: center;
  width: 50px;
}

.col-order {
  text-align: center;
  width: 60px;
  color: var(--text-hint);
}

/* ===== RESPONSIVE ADMIN DASHBOARD ===== */
.mobile-top-bar {
  display: none;
}

/* Stamps editor layout */
.admin-stamps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 650px;
}

.admin-stamp-item {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.admin-stamp-input {
  flex: 1;
  min-width: 150px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-input);
  background-color: var(--bg-input);
  color: var(--text-main);
}

.admin-stamp-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.admin-stamp-select {
  width: 220px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-input);
  background-color: var(--bg-input);
  color: var(--text-main);
  font-size: 0.95rem;
}

.admin-stamp-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.btn-remove-tag {
  padding: 10px 16px;
}

@media (max-width: 768px) {
  .mobile-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background-color: var(--bg-sidebar);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .mobile-menu-btn {
    background: none;
    border: none;
    color: var(--text-main);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu-icon {
    width: 24px;
    height: 24px;
  }

  .mobile-logo-area {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: var(--text-title);
    font-size: 1rem;
  }

  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1100;
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
  }

  .dashboard-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    z-index: 1050;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .content-header {
    padding: 20px 16px;
  }

  .content-title {
    font-size: 1.35rem;
  }

  .content-body {
    grid-template-columns: 1fr;
    padding: 20px 16px;
    gap: 24px;
  }

  .section-card {
    padding: 16px;
  }

  /* Table tweaks on mobile */
  .projects-table th, 
  .projects-table td {
    padding: 12px 10px;
    font-size: 0.85rem;
  }
  
  .col-desc {
    max-width: 140px;
  }

  /* Form spacing improvements */
  .form-actions {
    flex-wrap: wrap;
  }
  
  .form-actions button {
    flex-grow: 1;
  }

  /* Passport Graphic Preview Mobile Layout */
  .passport-manager-content {
    gap: 16px;
  }

  .passport-preview-frame {
    max-width: 180px;
  }
}
</style>
