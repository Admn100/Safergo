'use client'

import { motion } from 'framer-motion'
import { Car, MapPin, Users, Star } from 'lucide-react'

const stats = [
  {
    icon: Car,
    value: '500+',
    label: 'Trajets disponibles',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: MapPin,
    value: '24',
    label: 'Lieux touristiques',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
  {
    icon: Users,
    value: '1000+',
    label: 'Utilisateurs actifs',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Star,
    value: '4.8',
    label: 'Note moyenne',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              SafarGo en chiffres
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une communauté grandissante qui découvre l'Algérie ensemble
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}