import { createRouter, createWebHashHistory } from 'vue-router'
import { getCurrentUser } from './appwrite.js'
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
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // In hash history mode, to.hash is a real in-page anchor (e.g. #section),
    // NOT the route path (that's handled by the router itself).
    // Only scroll to element if it looks like a valid element ID anchor.
    if (to.hash && !to.hash.startsWith('#/')) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Authentication guard for Admin Dashboard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const user = await getCurrentUser()
    if (!user) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
