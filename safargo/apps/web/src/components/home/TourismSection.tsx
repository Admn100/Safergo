'use client'

import { Card, Badge, MapChip } from '@safargo/ui'
import { PLACE_TYPES } from '@safargo/shared'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function TourismSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Découvrez les merveilles de l'Algérie
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Explorez nos destinations touristiques et créez des trajets vers ces lieux magiques
          </p>
        </div>

        {/* Place type filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {Object.entries(PLACE_TYPES).map(([key, type]) => (
            <Link key={key} href={`/explore?type=${key}`}>
              <MapChip
                icon={type.icon}
                label={type.label}
                className="cursor-pointer"
              />
            </Link>
          ))}
        </div>

        {/* Featured places grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/places/${place.slug}`}>
                <Card className="overflow-hidden group cursor-pointer">
                  <div className="relative h-64">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {place.name}
                      </h3>
                      <p className="text-white/90 text-sm">{place.wilaya}</p>
                    </div>
                    <Badge
                      variant="default"
                      className="absolute top-4 right-4"
                    >
                      {PLACE_TYPES[place.type as keyof typeof PLACE_TYPES].label}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{place.rating}</span>
                        <span className="text-neutral-500 text-sm">
                          ({place.reviews} avis)
                        </span>
                      </div>
                      <Link
                        href={`/trips/new?placeId=${place.id}`}
                        className="text-algeria-green font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Y aller →
                      </Link>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-algeria-green text-white rounded-2xl font-medium hover:bg-primary-600 transition-colors"
            >
              Explorer tous les lieux
              <span className="text-xl">→</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}

const featuredPlaces = [
  {
    id: '1',
    slug: 'plage-sidi-fredj',
    name: 'Plage de Sidi Fredj',
    wilaya: 'Alger',
    type: 'BEACH',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    description: 'Belle plage à l\'ouest d\'Alger avec sable fin et eaux cristallines',
    rating: 4.5,
    reviews: 234,
  },
  {
    id: '2',
    slug: 'djurdjura',
    name: 'Djurdjura',
    wilaya: 'Tizi Ouzou',
    type: 'MOUNTAIN',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    description: 'Massif montagneux emblématique de Kabylie avec neige en hiver',
    rating: 4.9,
    reviews: 456,
  },
  {
    id: '3',
    slug: 'casbah-alger',
    name: 'Casbah d\'Alger',
    wilaya: 'Alger',
    type: 'HERITAGE',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    description: 'Médina historique classée UNESCO, cœur historique d\'Alger',
    rating: 4.6,
    reviews: 789,
  },
  {
    id: '4',
    slug: 'grand-erg-oriental',
    name: 'Grand Erg Oriental',
    wilaya: 'El Oued',
    type: 'DESERT',
    image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217',
    description: 'Immense mer de dunes dorées, paradis des amateurs du désert',
    rating: 4.9,
    reviews: 567,
  },
  {
    id: '5',
    slug: 'cascades-kefrida',
    name: 'Cascades de Kefrida',
    wilaya: 'Béjaïa',
    type: 'WATERFALL',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0',
    description: 'Magnifiques cascades dans un écrin de verdure',
    rating: 4.8,
    reviews: 189,
  },
  {
    id: '6',
    slug: 'timgad',
    name: 'Timgad',
    wilaya: 'Batna',
    type: 'HERITAGE',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
    description: 'Pompéi africaine, ville romaine exceptionnellement préservée',
    rating: 4.9,
    reviews: 345,
  },
]