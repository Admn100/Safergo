'use client'

import { Card, CardContent } from '@safargo/ui'
import { 
  Car, 
  MapPin, 
  Shield, 
  Star, 
  Users, 
  Clock,
  Heart,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Car,
    title: 'Covoiturage sécurisé',
    description: 'Voyagez en toute sécurité avec des conducteurs vérifiés et des véhicules contrôlés.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: MapPin,
    title: 'Découverte touristique',
    description: 'Explorez les plus beaux sites de l\'Algérie avec notre module tourisme intégré.',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Système de paiement en escrow : votre argent est protégé jusqu\'à la fin du trajet.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Star,
    title: 'Avis et notes',
    description: 'Système de notation pour garantir la qualité des trajets et la confiance.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Users,
    title: 'Communauté active',
    description: 'Rejoignez une communauté de voyageurs passionnés par la découverte de l\'Algérie.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Clock,
    title: 'Flexibilité',
    description: 'Trouvez des trajets à tout moment, pour des voyages spontanés ou planifiés.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
]

export function Features() {
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
              Pourquoi choisir SafarGo ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète qui combine covoiturage et tourisme pour vous faire découvrir 
              l'Algérie sous un nouvel angle.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-primary-600" />
              <Globe className="w-6 h-6 text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Fait avec ❤️ en Algérie
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SafarGo est une plateforme 100% algérienne, conçue pour mettre en valeur 
              la beauté et la richesse de notre pays. Chaque trajet est une nouvelle 
              aventure à découvrir.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}