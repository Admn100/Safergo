import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { api } from '../services/api'

interface User {
  id: string
  email: string
  phone?: string
  name: string
  photo?: string
  locale: string
  roles: string[]
  driver?: {
    id: string
    kycStatus: string
    rating: number
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  init: () => Promise<void>
  login: (token: string, user: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  init: async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ])

      if (token && userJson) {
        const user = JSON.parse(userJson)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        set({ user, token, isAuthenticated: true })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (token: string, user: User) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
      ])
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      set({ user, token, isAuthenticated: true })
    } catch (error) {
      console.error('Error saving auth data:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ])
      
      delete api.defaults.headers.common['Authorization']
      set({ user: null, token: null, isAuthenticated: false })
    } catch (error) {
      console.error('Error clearing auth data:', error)
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates }
      set({ user: updatedUser })
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser))
    }
  },
}))