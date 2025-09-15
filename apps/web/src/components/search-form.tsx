'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@safargo/ui'
import { Card, CardContent } from '@safargo/ui'
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function SearchForm() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    date: '',
    seats: 1,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (searchData.origin) params.set('origin', searchData.origin)
    if (searchData.destination) params.set('destination', searchData.destination)
    if (searchData.date) params.set('date', searchData.date)
    if (searchData.seats > 1) params.set('seats', searchData.seats.toString())
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Card className="card-glass max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Origin */}
            <div className="relative">
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                De
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="origin"
                  placeholder="Ville de départ"
                  value={searchData.origin}
                  onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Vers
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="destination"
                  placeholder="Ville d'arrivée"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Seats */}
            <div className="relative">
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                Places
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="seats"
                  value={searchData.seats}
                  onChange={(e) => setSearchData({ ...searchData, seats: parseInt(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
                >
                  <option value={1}>1 place</option>
                  <option value={2}>2 places</option>
                  <option value={3}>3 places</option>
                  <option value={4}>4 places</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="flex items-center space-x-2 px-8"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher des trajets</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}