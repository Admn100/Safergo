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
import { PLACE_TYPES } from '@safargo/shared'

interface PlaceCardProps {
  place: any
  style?: ViewStyle
  onPress?: () => void
}

export function PlaceCard({ place, style, onPress }: PlaceCardProps) {
  const placeType = PLACE_TYPES[place.type as keyof typeof PLACE_TYPES]

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: place.coverUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.typeIcon}>
          <Text style={styles.typeEmoji}>{placeType.icon}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
          <Text style={styles.wilaya}>{place.wilaya}</Text>
          
          <View style={styles.footer}>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{place.rating}</Text>
            </View>
            <Text style={styles.reviews}>({place.reviewCount})</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  typeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeEmoji: {
    fontSize: 20,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  wilaya: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#111827',
    marginLeft: 4,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
})