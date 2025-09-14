import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatDate, formatTime, formatPrice } from '@safargo/shared'

interface TripCardProps {
  trip: any
  style?: ViewStyle
  onPress?: () => void
}

export function TripCard({ trip, style, onPress }: TripCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: trip.driver.user.photo || 'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.driverName}>{trip.driver.user.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{trip.driver.rating}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.price}>{formatPrice(trip.pricePerSeat)}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={styles.dot} />
          <Text style={styles.routeLabel} numberOfLines={1}>
            {trip.origin.label}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.dot, styles.destinationDot]} />
          <Text style={styles.routeLabel} numberOfLines={1}>
            {trip.destination.label}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.footerText}>
            {formatDate(trip.dateTime, 'fr')}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.footerText}>
            {formatTime(trip.dateTime, 'fr')}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text style={styles.footerText}>{trip.availableSeats}</Text>
        </View>
      </View>

      {trip.tourismMode && (
        <View style={styles.tourismBadge}>
          <Text style={styles.tourismText}>Tourisme</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006233',
  },
  route: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006233',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#D21034',
  },
  routeLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 3.5,
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  tourismBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D21034',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tourismText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
})