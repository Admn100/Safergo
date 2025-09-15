import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { api } from '../services/api'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  photo?: string
  roles: string[]
  locale: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  loginWithOTP: (identifier: string, otp: string, name?: string) => Promise<void>
  requestOTP: (identifier: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { access_token, user } = response.data
          
          // Store token securely
          await SecureStore.setItemAsync('auth_token', access_token)
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Erreur de connexion',
            isLoading: false,
          })
        }
      },

      loginWithOTP: async (identifier: string, otp: string, name?: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/otp/verify', {
            identifier,
            otp,
            name,
          })
          const { access_token, user } = response.data
          
          // Store token securely
          await SecureStore.setItemAsync('auth_token', access_token)
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Code OTP invalide',
            isLoading: false,
          })
        }
      },

      requestOTP: async (identifier: string) => {
        set({ isLoading: true, error: null })
        try {
          await api.post('/auth/otp/request', { 
            [identifier.includes('@') ? 'email' : 'phone']: identifier 
          })
          set({ isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Erreur lors de l\'envoi du code',
            isLoading: false,
          })
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint
          await api.post('/auth/logout')
        } catch (error) {
          // Ignore logout errors
        } finally {
          // Clear secure storage
          await SecureStore.deleteItemAsync('auth_token')
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: async () => {
        set({ isLoading: true })
        try {
          const token = await SecureStore.getItemAsync('auth_token')
          if (token) {
            // Set token in API client
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            // Verify token and get user data
            const response = await api.get('/users/profile')
            set({
              user: response.data,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          // Token is invalid, clear it
          await SecureStore.deleteItemAsync('auth_token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)