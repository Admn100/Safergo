import { Button } from '@safargo/ui'
import { FlagIcon } from '@safargo/ui'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-safargo-green to-safargo-red">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <FlagIcon className="w-24 h-24 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6">
            🇩🇿 SafarGo
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Covoiturage & Tourisme Algérie
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="glass" 
              size="lg"
              className="text-white border-white/20 hover:bg-white/20"
            >
              Rechercher un trajet
            </Button>
            
            <Button 
              variant="glass-dark" 
              size="lg"
              className="text-white border-white/20 hover:bg-white/20"
            >
              Publier un trajet
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">🚗 Covoiturage</h3>
              <p className="text-white/80">
                Trouvez ou proposez des trajets partagés à travers l'Algérie
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">🏖️ Tourisme</h3>
              <p className="text-white/80">
                Découvrez les plus beaux sites touristiques algériens
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">🤝 Communauté</h3>
              <p className="text-white/80">
                Rejoignez une communauté de voyageurs passionnés
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}