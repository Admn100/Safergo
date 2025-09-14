'use client'

import Link from 'next/link'
import { FlagIcon } from '@safargo/ui'
import { Badge } from '@safargo/ui'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Rechercher', href: '/search' },
    { name: 'Publier', href: '/publish' },
    { name: 'Explorer', href: '/explore' },
    { name: 'Comment ça marche', href: '/how-it-works' },
  ],
  tourism: [
    { name: 'Lieux touristiques', href: '/places' },
    { name: 'Itinéraires', href: '/itineraries' },
    { name: 'Guides', href: '/guides' },
    { name: 'Événements', href: '/events' },
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Presse', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Centre d\'aide', href: '/help' },
    { name: 'Contact', href: '/contact' },
    { name: 'Sécurité', href: '/safety' },
    { name: 'Confidentialité', href: '/privacy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <FlagIcon className="w-8 h-8 text-primary-400" />
                <Badge variant="made-in-dz" className="absolute -top-2 -right-2 text-xs px-1 py-0.5">
                  DZ
                </Badge>
              </div>
              <span className="text-2xl font-bold">SafarGo</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Découvrez l'Algérie en covoiturage. Une plateforme qui combine 
              transport et tourisme pour une expérience unique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tourism */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tourisme</h3>
            <ul className="space-y-2">
              {footerLinks.tourism.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-400" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-gray-400">contact@safargo.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-400" />
              <div>
                <div className="font-semibold">Téléphone</div>
                <div className="text-gray-400">+213 555 123 456</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-400" />
              <div>
                <div className="font-semibold">Adresse</div>
                <div className="text-gray-400">Alger, Algérie</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 SafarGo. Tous droits réservés.
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>en Algérie</span>
          </div>
        </div>
      </div>
    </footer>
  )
}