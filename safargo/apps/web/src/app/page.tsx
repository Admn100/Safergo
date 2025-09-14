import { Hero } from '@/components/home/Hero'
import { SearchSection } from '@/components/home/SearchSection'
import { TourismSection } from '@/components/home/TourismSection'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <SearchSection />
      <TourismSection />
      <HowItWorks />
      <Footer />
    </main>
  )
}