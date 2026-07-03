import { createRouter, createWebHashHistory } from 'vue-router'
import { supabase } from './supabase.js'
import HomeView from './views/HomeView.vue'
import ProjectDetailView from './views/ProjectDetailView.vue'
import AdminLogin from './views/AdminLogin.vue'
import AdminDashboard from './views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailView,
    props: true
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Authentication guard for Admin Dashboard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
