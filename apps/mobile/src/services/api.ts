import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// Base URL for API
const BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api/v1'
  : 'https://api.safargo.com/api/v1'

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      try {
        await SecureStore.deleteItemAsync('auth_token')
        // Redirect to login screen
        // You can use navigation here if needed
      } catch (clearError) {
        console.error('Error clearing auth token:', clearError)
      }
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    requestOTP: '/auth/otp/request',
    verifyOTP: '/auth/otp/verify',
  },
  
  // Users
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    users: '/users',
  },
  
  // Trips
  trips: {
    list: '/trips',
    search: '/trips/search',
    create: '/trips',
    get: (id: string) => `/trips/${id}`,
    update: (id: string) => `/trips/${id}`,
    delete: (id: string) => `/trips/${id}`,
    updateStatus: (id: string) => `/trips/${id}/status`,
    tourism: '/trips/tourism',
  },
  
  // Bookings
  bookings: {
    list: '/bookings',
    create: '/bookings',
    get: (id: string) => `/bookings/${id}`,
    confirm: (id: string) => `/bookings/${id}/confirm`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
    finish: (id: string) => `/bookings/${id}/finish`,
    myBookings: '/bookings/my-bookings',
  },
  
  // Places
  places: {
    list: '/places',
    search: '/places/search',
    get: (id: string) => `/places/${id}`,
    getBySlug: (slug: string) => `/places/slug/${slug}`,
    getByType: (type: string) => `/places/type/${type}`,
    getByWilaya: (wilaya: string) => `/places/wilaya/${wilaya}`,
  },
  
  // Itineraries
  itineraries: {
    list: '/itineraries',
    search: '/itineraries/search',
    get: (id: string) => `/itineraries/${id}`,
  },
  
  // Payments
  payments: {
    createIntent: '/payments/intent',
    hold: (id: string) => `/payments/${id}/hold`,
    capture: (id: string) => `/payments/${id}/capture`,
    refund: (id: string) => `/payments/${id}/refund`,
    getByBooking: (bookingId: string) => `/payments/booking/${bookingId}`,
  },
  
  // Upload
  upload: {
    single: '/upload/single',
    multiple: '/upload/multiple',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markAsRead: (id: string) => `/notifications/${id}/read`,
  },
}

// API service functions
export const apiService = {
  // Auth
  login: (email: string, password: string) =>
    api.post(endpoints.auth.login, { email, password }),
  
  logout: () => api.post(endpoints.auth.logout),
  
  requestOTP: (identifier: string) =>
    api.post(endpoints.auth.requestOTP, {
      [identifier.includes('@') ? 'email' : 'phone']: identifier,
    }),
  
  verifyOTP: (identifier: string, otp: string, name?: string) =>
    api.post(endpoints.auth.verifyOTP, { identifier, otp, name }),
  
  // Users
  getProfile: () => api.get(endpoints.users.profile),
  
  updateProfile: (data: any) => api.patch(endpoints.users.updateProfile, data),
  
  // Trips
  getTrips: (params?: any) => api.get(endpoints.trips.list, { params }),
  
  searchTrips: (params: any) => api.get(endpoints.trips.search, { params }),
  
  createTrip: (data: any) => api.post(endpoints.trips.create, data),
  
  getTrip: (id: string) => api.get(endpoints.trips.get(id)),
  
  updateTrip: (id: string, data: any) => api.patch(endpoints.trips.update(id), data),
  
  deleteTrip: (id: string) => api.delete(endpoints.trips.delete(id)),
  
  updateTripStatus: (id: string, status: string) =>
    api.patch(endpoints.trips.updateStatus(id), { status }),
  
  getTourismTrips: () => api.get(endpoints.trips.tourism),
  
  // Bookings
  getBookings: () => api.get(endpoints.bookings.list),
  
  createBooking: (data: any) => api.post(endpoints.bookings.create, data),
  
  getBooking: (id: string) => api.get(endpoints.bookings.get(id)),
  
  confirmBooking: (id: string) => api.patch(endpoints.bookings.confirm(id)),
  
  cancelBooking: (id: string) => api.patch(endpoints.bookings.cancel(id)),
  
  finishBooking: (id: string) => api.patch(endpoints.bookings.finish(id)),
  
  getMyBookings: () => api.get(endpoints.bookings.myBookings),
  
  // Places
  getPlaces: (params?: any) => api.get(endpoints.places.list, { params }),
  
  searchPlaces: (params: any) => api.get(endpoints.places.search, { params }),
  
  getPlace: (id: string) => api.get(endpoints.places.get(id)),
  
  getPlaceBySlug: (slug: string) => api.get(endpoints.places.getBySlug(slug)),
  
  getPlacesByType: (type: string) => api.get(endpoints.places.getByType(type)),
  
  getPlacesByWilaya: (wilaya: string) => api.get(endpoints.places.getByWilaya(wilaya)),
  
  // Itineraries
  getItineraries: (params?: any) => api.get(endpoints.itineraries.list, { params }),
  
  searchItineraries: (params: any) => api.get(endpoints.itineraries.search, { params }),
  
  getItinerary: (id: string) => api.get(endpoints.itineraries.get(id)),
  
  // Payments
  createPaymentIntent: (data: any) => api.post(endpoints.payments.createIntent, data),
  
  holdPayment: (id: string) => api.post(endpoints.payments.hold(id)),
  
  capturePayment: (id: string) => api.post(endpoints.payments.capture(id)),
  
  refundPayment: (id: string) => api.post(endpoints.payments.refund(id)),
  
  getPaymentsByBooking: (bookingId: string) =>
    api.get(endpoints.payments.getByBooking(bookingId)),
  
  // Upload
  uploadSingle: (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(endpoints.upload.single, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  uploadMultiple: (files: any[]) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('files', file)
    })
    return api.post(endpoints.upload.multiple, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // Notifications
  getNotifications: () => api.get(endpoints.notifications.list),
  
  markNotificationAsRead: (id: string) => api.patch(endpoints.notifications.markAsRead(id)),
}

export default api