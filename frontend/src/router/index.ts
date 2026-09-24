import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { guest: true }
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'products',
          name: 'Products',
          component: ProductsView,
          meta: { title: 'Produk' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

// Navigation guard
router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token')

  // Check if current route OR any ancestor requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    return '/login'
  }
  // Redirect logged-in users away from login page
  if (to.path === '/login' && isAuthenticated) {
    return '/dashboard'
  }
})

export default router
