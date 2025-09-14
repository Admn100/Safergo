'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@safargo/ui'
import { FlagIcon } from '@safargo/ui'
import { Badge } from '@safargo/ui'
import { ArrowRight, Download, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

export function CTA() {
  const router = useRouter()

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <FlagIcon className="w-8 h-8 text-white" animated />
              <Badge variant="made-in-dz" className="bg-white/20 text-white border-white/30">
                Made in Algeria
              </Badge>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à découvrir l'Algérie ?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Rejoignez notre communauté et commencez votre aventure dès aujourd'hui. 
              Téléchargez l'app ou créez votre compte en quelques minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
              className="bg-white text-primary-600 border-white hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>Créer un compte</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              variant="ghost"
              onClick={() => router.push('/download')}
              className="text-white border-white/30 hover:bg-white/10 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger l'app</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <div className="flex items-center space-x-3 text-white/90">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Disponible sur</div>
                <div className="text-sm">iOS & Android</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">🌍</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Multilingue</div>
                <div className="text-sm">Français & Arabe</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">🔒</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Sécurisé</div>
                <div className="text-sm">Paiement protégé</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}