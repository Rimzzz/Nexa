import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface User {
  id: number
  username: string
  fullName: string
  role: string
}

interface LoginResponse {
  access_token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      const data: LoginResponse = response.data
      
      token.value = data.access_token
      user.value = data.user
      
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
      
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login gagal' }
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout
  }
})
