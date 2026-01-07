import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Tasks from '../views/Tasks.vue'
import { isAuthenticated } from '../services/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/tasks', component: Tasks }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guard de autenticação
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !isAuthenticated()) {
    return next('/login')
  }

  next()
})

export default router
