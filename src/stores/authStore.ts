import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials } from '@/types'

const AUTH_STORAGE_KEY = 'freshmart_auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const displayName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  )

  /** Restore session from localStorage on app boot */
  function init(): void {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        user.value = JSON.parse(stored) as AuthUser
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // Check for demo credentials
      if (credentials.username === 'freshmart' && credentials.password === 'FreshMart1@') {
        const mockUser: AuthUser = {
          id: 999,
          username: 'freshmart',
          email: 'demo@freshmart.com',
          firstName: 'Fresh',
          lastName: 'Mart',
          gender: 'other',
          image: '',
          accessToken: 'demo-token',
          refreshToken: 'demo-refresh',
        }
        user.value = mockUser
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser))
        return
      }

      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Invalid credentials' }))
        throw new Error(
          (errorBody as { message?: string }).message ?? 'Invalid credentials',
        )
      }

      const data = (await response.json()) as AuthUser
      user.value = data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    error.value = null
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  function clearError(): void {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    displayName,
    init,
    login,
    logout,
    clearError,
  }
})
