'use client'

import { Card } from '@safargo/ui'
import { Search, Calendar, CreditCard, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Partagez vos trajets en toute simplicité
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center h-full">
                <div className="w-16 h-16 bg-algeria-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-algeria-green" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Pour les passagers</h3>
            <ul className="space-y-3">
              {passengerBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-algeria-green rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Pour les conducteurs</h3>
            <ul className="space-y-3">
              {driverBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-algeria-red rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    icon: Search,
    title: 'Recherchez',
    description: 'Trouvez le trajet qui correspond à vos besoins',
  },
  {
    icon: Calendar,
    title: 'Réservez',
    description: 'Réservez votre place en quelques clics',
  },
  {
    icon: CreditCard,
    title: 'Payez',
    description: 'Paiement sécurisé, débité après le trajet',
  },
  {
    icon: Star,
    title: 'Évaluez',
    description: 'Partagez votre expérience avec la communauté',
  },
]

const passengerBenefits = [
  'Trajets économiques partout en Algérie',
  'Découverte de destinations touristiques',
  'Paiement sécurisé après le trajet',
  'Profils conducteurs vérifiés',
  'Assurance voyage incluse',
]

const driverBenefits = [
  'Rentabilisez vos trajets quotidiens',
  'Communauté de voyageurs respectueux',
  'Paiements garantis et rapides',
  'Gestion simple de vos annonces',
  'Support 24/7 en cas de besoin',
]