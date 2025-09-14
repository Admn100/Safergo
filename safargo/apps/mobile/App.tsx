import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import { I18nextProvider } from 'react-i18next'
import i18n from './src/utils/i18n'
import { Navigation } from './src/navigation'
import { useAuthStore } from './src/stores/auth'

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
    },
  },
})

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false)
  const initAuth = useAuthStore((state) => state.init)

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
          'Cairo-Regular': require('./assets/fonts/Cairo-Regular.ttf'),
          'Cairo-SemiBold': require('./assets/fonts/Cairo-SemiBold.ttf'),
          'Cairo-Bold': require('./assets/fonts/Cairo-Bold.ttf'),
        })

        // Initialize auth
        await initAuth()

        setFontsLoaded(true)
      } catch (e) {
        console.warn(e)
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  )
}