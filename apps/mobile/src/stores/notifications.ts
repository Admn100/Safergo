import { create } from 'zustand'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

export interface Notification {
  id: string
  title: string
  body: string
  data?: any
  type: 'trip' | 'booking' | 'message' | 'system'
  read: boolean
  createdAt: Date
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isEnabled: boolean
  expoPushToken: string | null
  cleanup?: () => void
}

export interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  initializeNotifications: () => Promise<void>
  requestPermissions: () => Promise<boolean>
  sendPushNotification: (token: string, title: string, body: string, data?: any) => Promise<void>
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  (set, get) => ({
    // State
    notifications: [],
    unreadCount: 0,
    isEnabled: false,
    expoPushToken: null,

    // Actions
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }))
    },

    markAsRead: (id: string) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    },

    markAllAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }))
    },

    removeNotification: (id: string) => {
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id)
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: notification?.read ? state.unreadCount : Math.max(0, state.unreadCount - 1),
        }
      })
    },

    clearAll: () => {
      set({
        notifications: [],
        unreadCount: 0,
      })
    },

    initializeNotifications: async () => {
      try {
        // Request permissions
        const hasPermission = await get().requestPermissions()
        if (!hasPermission) return

        // Get push token
        if (Device.isDevice) {
          const token = await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id', // Replace with your project ID
          })
          set({ expoPushToken: token.data })
        }

        // Listen for notifications
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
          get().addNotification({
            title: notification.request.content.title || 'Nouvelle notification',
            body: notification.request.content.body || '',
            data: notification.request.content.data,
            type: notification.request.content.data?.type || 'system',
            read: false,
          })
        })

        // Listen for notification responses (when user taps on notification)
        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
          const notification = response.notification
          // Handle notification tap
          console.log('Notification tapped:', notification)
        })

        set({ isEnabled: true })

        // Store cleanup function
        set({ 
          cleanup: () => {
            subscription.remove()
            responseSubscription.remove()
          }
        })
      } catch (error) {
        console.error('Error initializing notifications:', error)
      }
    },

    requestPermissions: async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync()
          finalStatus = status
        }

        if (finalStatus !== 'granted') {
          return false
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#006233',
          })
        }

        return true
      } catch (error) {
        console.error('Error requesting notification permissions:', error)
        return false
      }
    },

    sendPushNotification: async (token: string, title: string, body: string, data?: any) => {
      try {
        const message = {
          to: token,
          sound: 'default',
          title,
          body,
          data,
        }

        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        })
      } catch (error) {
        console.error('Error sending push notification:', error)
      }
    },
  })
)