'use client'

import { useState } from 'react'
import { Button, Input, Card } from '@safargo/ui'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SearchSection() {
  const router = useRouter()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState('1')

  const handleSearch = () => {
    const params = new URLSearchParams({
      ...(origin && { origin }),
      ...(destination && { destination }),
      ...(date && { date }),
      ...(seats && { seats }),
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="py-16 px-4 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Recherchez votre trajet idéal
        </h2>

        <Card className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-algeria-green" />
                Départ
              </label>
              <Input
                placeholder="D'où partez-vous ?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-algeria-red" />
                Arrivée
              </label>
              <Input
                placeholder="Où allez-vous ?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-500" />
                Places
              </label>
              <Input
                type="number"
                min="1"
                max="8"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            size="lg"
            className="w-full md:w-auto md:min-w-[200px] mx-auto block"
          >
            Rechercher
          </Button>
        </Card>

        {/* Popular routes */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Trajets populaires</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route) => (
              <Card
                key={route.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setOrigin(route.origin)
                  setDestination(route.destination)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-algeria-green rounded-full" />
                  <span className="font-medium">{route.origin}</span>
                  <div className="flex-1 border-t-2 border-dashed border-neutral-300" />
                  <span className="font-medium">{route.destination}</span>
                  <div className="w-2 h-2 bg-algeria-red rounded-full" />
                </div>
                <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  À partir de {route.price} DZD
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const popularRoutes = [
  { id: 1, origin: 'Alger', destination: 'Oran', price: 1500 },
  { id: 2, origin: 'Alger', destination: 'Constantine', price: 2000 },
  { id: 3, origin: 'Alger', destination: 'Béjaïa', price: 1200 },
  { id: 4, origin: 'Oran', destination: 'Tlemcen', price: 800 },
  { id: 5, origin: 'Constantine', destination: 'Annaba', price: 1000 },
  { id: 6, origin: 'Alger', destination: 'Tipaza', price: 500 },
]