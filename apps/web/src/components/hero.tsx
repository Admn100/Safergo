'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@safargo/ui'
import { Card, CardContent } from '@safargo/ui'
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { SearchForm } from './search-form'

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Découvrez l'
              <span className="text-primary-600">Algérie</span>
              <br />
              en <span className="text-secondary-600">covoiturage</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trouvez des trajets vers les plus beaux sites touristiques du pays. 
              Partagez vos voyages et découvrez de nouveaux horizons avec SafarGo.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <SearchForm />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => router.push('/publish')}
              className="flex items-center space-x-2"
            >
              <span>Publier un trajet</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/explore')}
              className="flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Explorer la carte</span>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Trajets disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">24</div>
              <div className="text-gray-600">Lieux touristiques</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Utilisateurs actifs</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="absolute top-20 left-10 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="card-glass w-64">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Covoiturage</div>
                  <div className="text-sm text-gray-600">Trajets quotidiens</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute top-32 right-10 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="card-glass w-64">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Tourisme</div>
                  <div className="text-sm text-gray-600">Découvrez l'Algérie</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}