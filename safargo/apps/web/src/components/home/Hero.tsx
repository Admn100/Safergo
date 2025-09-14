'use client'

import { Button, AlgeriaFlag } from '@safargo/ui'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1590333748338-d629e4564ad9"
          alt="Algérie paysage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 via-neutral-900/50 to-neutral-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Flag */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <AlgeriaFlag size="lg" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Voyagez ensemble,
            <br />
            <span className="text-algeria-green">découvrez l'Algérie</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-neutral-200">
            Partagez vos trajets et explorez les merveilles touristiques
            <br />
            de notre beau pays
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="min-w-[200px]">
                Trouver un trajet
              </Button>
            </Link>
            <Link href="/publish">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-white/10 backdrop-blur-sm">
                Publier un trajet
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div>
              <div className="text-3xl font-bold text-algeria-green">50k+</div>
              <div className="text-neutral-300">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-algeria-green">24+</div>
              <div className="text-neutral-300">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-algeria-green">4.8/5</div>
              <div className="text-neutral-300">Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}