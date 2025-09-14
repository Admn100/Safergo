'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@safargo/ui'
import { TourismChip } from '@safargo/ui'
import { Button } from '@safargo/ui'
import { 
  MapPin, 
  Star, 
  Users, 
  ArrowRight,
  Mountain,
  Waves,
  Camera,
  Utensils
} from 'lucide-react'
import { motion } from 'framer-motion'

const tourismPlaces = [
  {
    id: '1',
    name: 'Plage de Sidi Fredj',
    type: 'beach',
    wilaya: 'Alger',
    rating: 4.6,
    reviewCount: 128,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    tags: ['family', 'sunset'],
  },
  {
    id: '2',
    name: 'Cascades de Kefrida',
    type: 'waterfall',
    wilaya: 'Jijel',
    rating: 4.9,
    reviewCount: 95,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['hiking', 'nature'],
  },
  {
    id: '3',
    name: 'Djurdjura',
    type: 'mountain',
    wilaya: 'Tizi Ouzou',
    rating: 4.8,
    reviewCount: 134,
    coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=400&h=300&fit=crop',
    tags: ['hiking', 'skiing'],
  },
  {
    id: '4',
    name: 'Casbah d\'Alger',
    type: 'heritage',
    wilaya: 'Alger',
    rating: 4.5,
    reviewCount: 234,
    coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
    tags: ['history', 'unesco'],
  },
]

const tourismCategories = [
  { type: 'beach', label: 'Plages', icon: Waves, count: 4 },
  { type: 'waterfall', label: 'Cascades', icon: Camera, count: 2 },
  { type: 'mountain', label: 'Montagnes', icon: Mountain, count: 3 },
  { type: 'heritage', label: 'Patrimoine', icon: Camera, count: 5 },
  { type: 'food', label: 'Gastronomie', icon: Utensils, count: 3 },
]

export function TourismSection() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPlaces = selectedCategory 
    ? tourismPlaces.filter(place => place.type === selectedCategory)
    : tourismPlaces

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Découvrez l'Algérie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explorez les plus beaux sites touristiques du pays. 
              Trouvez des trajets vers ces destinations exceptionnelles.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full border-2 transition-colors ${
                selectedCategory === null
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary-600'
              }`}
            >
              Tous ({tourismPlaces.length})
            </button>
            {tourismCategories.map((category) => (
              <button
                key={category.type}
                onClick={() => setSelectedCategory(category.type)}
                className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center space-x-2 ${
                  selectedCategory === category.type
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-primary-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label} ({category.count})</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.coverUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <TourismChip category={place.type} size="sm" />
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {place.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{place.wilaya}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{place.reviewCount} avis</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/places/${place.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <span>Voir</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => router.push('/explore')}
            className="flex items-center space-x-2 mx-auto"
          >
            <MapPin className="w-5 h-5" />
            <span>Explorer la carte complète</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}