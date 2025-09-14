import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../stores/auth'
import { TripCard } from '../components/TripCard'
import { PlaceCard } from '../components/PlaceCard'
import { AlgeriaFlag } from '../components/AlgeriaFlag'
import { tripsService, placesService } from '../services/api'

export function HomeScreen() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const [nearbyTrips, setNearbyTrips] = useState([])
  const [featuredPlaces, setFeaturedPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      const [tripsRes, placesRes] = await Promise.all([
        tripsService.search({ limit: 5, sort: 'date' }),
        placesService.search({ limit: 6, sort: 'rating' }),
      ])
      
      setNearbyTrips(tripsRes.data.data)
      setFeaturedPlaces(placesRes.data.data)
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006233" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                {t('home.welcome')}, {user?.name}!
              </Text>
              <Text style={styles.subGreeting}>
                {new Date().toLocaleDateString('fr-DZ', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>
            <AlgeriaFlag size={30} />
          </View>

          {/* Search Bar */}
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <Text style={styles.searchPlaceholder}>
              {t('home.searchPlaceholder')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.nearbyTrips')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {nearbyTrips.map((trip: any) => (
              <TripCard key={trip.id} trip={trip} style={styles.tripCard} />
            ))}
          </ScrollView>
        </View>

        {/* Tourism Spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.tourismSpots')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.placesGrid}>
            {featuredPlaces.map((place: any) => (
              <PlaceCard key={place.id} place={place} style={styles.placeCard} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#006233',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  tripCard: {
    marginRight: 16,
    width: 280,
  },
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  placeCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
})