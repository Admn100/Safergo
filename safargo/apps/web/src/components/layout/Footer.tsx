import Link from 'next/link'
import { AlgeriaFlag } from '@safargo/ui'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <AlgeriaFlag size="sm" />
              <span className="text-2xl font-bold">SafarGo</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Voyagez ensemble, découvrez l'Algérie
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span>Made with ❤️ in DZ</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Covoiturage</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-neutral-400 hover:text-white transition-colors">
                  Rechercher un trajet
                </Link>
              </li>
              <li>
                <Link href="/publish" className="text-neutral-400 hover:text-white transition-colors">
                  Publier un trajet
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tourisme</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-neutral-400 hover:text-white transition-colors">
                  Explorer la carte
                </Link>
              </li>
              <li>
                <Link href="/places" className="text-neutral-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/itineraries" className="text-neutral-400 hover:text-white transition-colors">
                  Itinéraires
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Blog voyage
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-400 hover:text-white transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-neutral-400 hover:text-white transition-colors">
                  Presse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-neutral-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
            <div className="text-sm text-neutral-400">
              © {new Date().getFullYear()} SafarGo. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}