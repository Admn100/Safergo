import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuthStore } from '../stores/auth'

// Import screens
import { SplashScreen } from '../screens/SplashScreen'
import { OnboardingScreen } from '../screens/OnboardingScreen'
import { LoginScreen } from '../screens/auth/LoginScreen'
import { OtpScreen } from '../screens/auth/OtpScreen'
import { MainNavigator } from './MainNavigator'

export type RootStackParamList = {
  Splash: undefined
  Onboarding: undefined
  Login: undefined
  Otp: { email?: string; phone?: string }
  Main: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function Navigation() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}