'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@safargo/ui'
import { FlagIcon } from '@safargo/ui'
import { Badge } from '@safargo/ui'
import { Menu, X, MapPin, User, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Rechercher', href: '/search' },
    { name: 'Publier', href: '/publish' },
    { name: 'Explorer', href: '/explore' },
    { name: 'À propos', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <FlagIcon className="w-8 h-8 text-primary-600" animated />
              <Badge variant="made-in-dz" className="absolute -top-2 -right-2 text-xs px-1 py-0.5">
                DZ
              </Badge>
            </div>
            <span className="text-2xl font-bold text-gray-900">SafarGo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/explore')}
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Explorer</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/login')}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Connexion</span>
            </Button>
            
            <Button
              size="sm"
              onClick={() => router.push('/register')}
              className="flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>S'inscrire</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <nav className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="px-4 pt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push('/explore')
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Explorer</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push('/login')
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Connexion</span>
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      router.push('/register')
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>S'inscrire</span>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}