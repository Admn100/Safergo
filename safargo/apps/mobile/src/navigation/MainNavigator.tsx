import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

// Import screens
import { HomeScreen } from '../screens/HomeScreen'
import { SearchScreen } from '../screens/SearchScreen'
import { PublishScreen } from '../screens/PublishScreen'
import { BookingsScreen } from '../screens/BookingsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'

export type MainTabParamList = {
  Home: undefined
  Search: undefined
  Publish: undefined
  Bookings: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const { t } = useTranslation()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Search':
              iconName = focused ? 'search' : 'search-outline'
              break
            case 'Publish':
              iconName = focused ? 'add-circle' : 'add-circle-outline'
              break
            case 'Bookings':
              iconName = focused ? 'car' : 'car-outline'
              break
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline'
              break
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#006233',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#006233',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: t('nav.home'), headerShown: false }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: t('nav.search') }}
      />
      <Tab.Screen 
        name="Publish" 
        component={PublishScreen}
        options={{ title: t('nav.publish') }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{ title: t('nav.bookings') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: t('nav.profile') }}
      />
    </Tab.Navigator>
  )
}