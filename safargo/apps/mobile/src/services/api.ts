import axios from 'axios'
import Constants from 'expo-constants'

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log requests in dev
    if (__DEV__) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      const { useAuthStore } = await import('../stores/auth')
      await useAuthStore.getState().logout()
    }
    
    if (__DEV__) {
      console.error('API Error:', error.response?.data || error.message)
    }
    
    return Promise.reject(error)
  },
)

// Auth service
export const authService = {
  requestOtp: (data: { email?: string; phone?: string; locale: string }) =>
    api.post('/auth/otp/request', data),
    
  verifyOtp: (data: { email?: string; phone?: string; code: string }) =>
    api.post('/auth/otp/verify', data),
    
  logout: () => api.post('/auth/logout'),
}

// Trips service
export const tripsService = {
  search: (params: any) => api.get('/trips', { params }),
  
  getTrip: (id: string) => api.get(`/trips/${id}`),
  
  createTrip: (data: any) => api.post('/trips', data),
  
  updateTripStatus: (id: string, status: string) =>
    api.patch(`/trips/${id}/status`, { status }),
}

// Bookings service
export const bookingsService = {
  create: (data: { tripId: string; seats: number }) =>
    api.post('/bookings', data),
    
  getUserBookings: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings', { params }),
    
  getBooking: (id: string) => api.get(`/bookings/${id}`),
  
  cancel: (id: string, reason?: string) =>
    api.delete(`/bookings/${id}`, { data: { reason } }),
    
  confirm: (id: string) => api.patch(`/bookings/${id}/confirm`),
  
  finish: (id: string) => api.patch(`/bookings/${id}/finish`),
}

// Places service
export const placesService = {
  search: (params: any) => api.get('/places', { params }),
  
  getPlace: (id: string) => api.get(`/places/${id}`),
  
  createReview: (placeId: string, data: { rating: number; text?: string; photos?: string[] }) =>
    api.post(`/places/${placeId}/reviews`, data),
}

// Messages service
export const messagesService = {
  getConversations: (params?: { page?: number; limit?: number }) =>
    api.get('/messages/conversations', { params }),
    
  createConversation: (data: { userId: string; bookingId?: string }) =>
    api.post('/messages/conversations', data),
    
  getMessages: (conversationId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/messages/conversations/${conversationId}`, { params }),
    
  sendMessage: (conversationId: string, text: string) =>
    api.post(`/messages/conversations/${conversationId}`, { text }),
    
  flagMessage: (messageId: string) =>
    api.post(`/messages/messages/${messageId}/flag`),
}

// User service
export const userService = {
  getProfile: () => api.get('/users/me'),
  
  updateProfile: (data: { name?: string; photo?: string; locale?: string }) =>
    api.patch('/users/me', data),
    
  becomeDriver: (licenseNumber: string) =>
    api.post('/users/become-driver', { licenseNumber }),
    
  getUserReviews: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/users/${userId}/reviews`, { params }),
}