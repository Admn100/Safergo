import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { TourismSection } from '@/components/tourism-section'
import { Stats } from '@/components/stats'
import { Testimonials } from '@/components/testimonials'
import { CTA } from '@/components/cta'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <TourismSection />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}