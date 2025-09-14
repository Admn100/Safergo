import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const DEMO_PLACES = [
  // Plages
  {
    name: 'Plage de Sidi Fredj',
    slug: 'plage-sidi-fredj',
    type: 'BEACH',
    wilaya: 'Alger',
    lat: 36.7683,
    lng: 2.8409,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    gallery: [],
    description: 'Belle plage à l\'ouest d\'Alger avec sable fin et eaux cristallines',
    tags: ['family', 'sunset', 'swimming'],
    ratingAgg: 4.5,
    reviewCount: 234,
    safetyNotes: 'Surveillée en été. Forte houle par vent d\'est.',
  },
  {
    name: 'Plage des Sablettes',
    slug: 'plage-sablettes',
    type: 'BEACH',
    wilaya: 'Alger',
    lat: 36.8097,
    lng: 3.1819,
    coverUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
    gallery: [],
    description: 'Plage urbaine populaire près de Bab El Oued',
    tags: ['urban', 'accessible'],
    ratingAgg: 4.2,
    reviewCount: 156,
    safetyNotes: 'Éviter les jours de forte affluence.',
  },
  {
    name: 'Plage de Tipaza',
    slug: 'plage-tipaza',
    type: 'BEACH',
    wilaya: 'Tipaza',
    lat: 36.5897,
    lng: 2.4477,
    coverUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
    gallery: [],
    description: 'Plage historique près des ruines romaines',
    tags: ['history', 'swimming', 'family'],
    ratingAgg: 4.7,
    reviewCount: 312,
    safetyNotes: 'Parking payant. Prévoir de l\'eau.',
  },
  
  // Cascades
  {
    name: 'Cascades de Kefrida',
    slug: 'cascades-kefrida',
    type: 'WATERFALL',
    wilaya: 'Béjaïa',
    lat: 36.5833,
    lng: 4.6833,
    coverUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0',
    gallery: [],
    description: 'Magnifiques cascades dans un écrin de verdure',
    tags: ['hiking', 'nature', 'photography'],
    ratingAgg: 4.8,
    reviewCount: 189,
    safetyNotes: 'Sentier glissant par temps humide. Chaussures de randonnée recommandées.',
  },
  {
    name: 'Cascade de Tamda',
    slug: 'cascade-tamda',
    type: 'WATERFALL',
    wilaya: 'Tizi Ouzou',
    lat: 36.6167,
    lng: 4.2167,
    coverUrl: 'https://images.unsplash.com/photo-1549828838-0e3373b76d18',
    gallery: [],
    description: 'Cascade impressionnante en pleine montagne kabyle',
    tags: ['adventure', 'hiking', 'nature'],
    ratingAgg: 4.6,
    reviewCount: 98,
    safetyNotes: 'Accès difficile. Guide local recommandé.',
  },
  
  // Montagnes
  {
    name: 'Djurdjura',
    slug: 'djurdjura',
    type: 'MOUNTAIN',
    wilaya: 'Tizi Ouzou',
    lat: 36.4547,
    lng: 4.2047,
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    gallery: [],
    description: 'Massif montagneux emblématique de Kabylie',
    tags: ['hiking', 'snow', 'nature', 'camping'],
    ratingAgg: 4.9,
    reviewCount: 456,
    safetyNotes: 'Conditions météo changeantes. Équipement de montagne nécessaire.',
  },
  {
    name: 'Mont Chélia',
    slug: 'mont-chelia',
    type: 'MOUNTAIN',
    wilaya: 'Batna',
    lat: 35.3167,
    lng: 6.6667,
    coverUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e',
    gallery: [],
    description: 'Plus haut sommet des Aurès (2328m)',
    tags: ['hiking', 'adventure', 'panorama'],
    ratingAgg: 4.7,
    reviewCount: 123,
    safetyNotes: 'Altitude élevée. Acclimatation recommandée.',
  },
  
  // Désert
  {
    name: 'Grand Erg Oriental',
    slug: 'grand-erg-oriental',
    type: 'DESERT',
    wilaya: 'El Oued',
    lat: 33.5000,
    lng: 6.8333,
    coverUrl: 'https://images.unsplash.com/photo-1542401886-65d6c61db217',
    gallery: [],
    description: 'Immense mer de dunes dorées',
    tags: ['desert', 'adventure', 'camping', 'photography'],
    ratingAgg: 4.9,
    reviewCount: 567,
    safetyNotes: 'Excursion avec guide obligatoire. Prévoir eau et protection solaire.',
  },
  {
    name: 'Tassili n\'Ajjer',
    slug: 'tassili-najjer',
    type: 'DESERT',
    wilaya: 'Illizi',
    lat: 25.5000,
    lng: 8.0000,
    coverUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    gallery: [],
    description: 'Plateau aux paysages lunaires et art rupestre préhistorique',
    tags: ['unesco', 'history', 'trekking', 'art'],
    ratingAgg: 5.0,
    reviewCount: 234,
    safetyNotes: 'Zone protégée. Permis spécial requis.',
  },
  
  // Patrimoine
  {
    name: 'Casbah d\'Alger',
    slug: 'casbah-alger',
    type: 'HERITAGE',
    wilaya: 'Alger',
    lat: 36.7847,
    lng: 3.0608,
    coverUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    gallery: [],
    description: 'Médina historique classée UNESCO',
    tags: ['unesco', 'history', 'architecture', 'culture'],
    ratingAgg: 4.6,
    reviewCount: 789,
    safetyNotes: 'Visite guidée recommandée. Éviter les objets de valeur visibles.',
  },
  {
    name: 'Ruines de Tipaza',
    slug: 'ruines-tipaza',
    type: 'HERITAGE',
    wilaya: 'Tipaza',
    lat: 36.5897,
    lng: 2.4477,
    coverUrl: 'https://images.unsplash.com/photo-1552834020-09e5680c4a5f',
    gallery: [],
    description: 'Site archéologique romain face à la mer',
    tags: ['unesco', 'history', 'roman', 'archaeology'],
    ratingAgg: 4.8,
    reviewCount: 456,
    safetyNotes: 'Protection solaire indispensable. Terrain irrégulier.',
  },
  {
    name: 'Timgad',
    slug: 'timgad',
    type: 'HERITAGE',
    wilaya: 'Batna',
    lat: 35.4847,
    lng: 6.4694,
    coverUrl: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
    gallery: [],
    description: 'Pompéi africaine, ville romaine exceptionnellement préservée',
    tags: ['unesco', 'roman', 'archaeology', 'history'],
    ratingAgg: 4.9,
    reviewCount: 345,
    safetyNotes: 'Site vaste. Prévoir eau et chaussures confortables.',
  },
  
  // Oasis
  {
    name: 'Oasis de Biskra',
    slug: 'oasis-biskra',
    type: 'OASIS',
    wilaya: 'Biskra',
    lat: 34.8500,
    lng: 5.7333,
    coverUrl: 'https://images.unsplash.com/photo-1590333748338-d629e4564ad9',
    gallery: [],
    description: 'Porte du désert avec palmeraies luxuriantes',
    tags: ['oasis', 'dates', 'relaxation'],
    ratingAgg: 4.5,
    reviewCount: 234,
    safetyNotes: 'Chaleur intense en été. Hydratation importante.',
  },
  
  // Panoramas
  {
    name: 'Balcon de Ghoufi',
    slug: 'balcon-ghoufi',
    type: 'VIEWPOINT',
    wilaya: 'Batna',
    lat: 35.1667,
    lng: 6.6667,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    gallery: [],
    description: 'Vue spectaculaire sur les gorges et les villages berbères',
    tags: ['panorama', 'photography', 'berber'],
    ratingAgg: 4.8,
    reviewCount: 167,
    safetyNotes: 'Route sinueuse. Barrières de sécurité limitées.',
  },
  
  // Parcs
  {
    name: 'Parc National de Chréa',
    slug: 'parc-chrea',
    type: 'PARK',
    wilaya: 'Blida',
    lat: 36.4333,
    lng: 2.8667,
    coverUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    gallery: [],
    description: 'Cèdres millénaires et station de ski',
    tags: ['nature', 'hiking', 'skiing', 'cedar'],
    ratingAgg: 4.7,
    reviewCount: 289,
    safetyNotes: 'Routes enneigées en hiver. Chaînes parfois nécessaires.',
  },
  {
    name: 'Jardin d\'Essai du Hamma',
    slug: 'jardin-essai-hamma',
    type: 'PARK',
    wilaya: 'Alger',
    lat: 36.7469,
    lng: 3.0753,
    coverUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    gallery: [],
    description: 'Jardin botanique historique au cœur d\'Alger',
    tags: ['botanical', 'family', 'relaxation'],
    ratingAgg: 4.6,
    reviewCount: 456,
    safetyNotes: 'Fermeture à 17h. Interdiction de cueillir les plantes.',
  },
  
  // Gastronomie
  {
    name: 'Marché de la Pêcherie',
    slug: 'marche-pecherie',
    type: 'FOOD',
    wilaya: 'Alger',
    lat: 36.7753,
    lng: 3.0692,
    coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    gallery: [],
    description: 'Marché aux poissons frais et restaurants de fruits de mer',
    tags: ['seafood', 'market', 'local'],
    ratingAgg: 4.4,
    reviewCount: 234,
    safetyNotes: 'Négocier les prix. Vérifier la fraîcheur.',
  },
  
  // Médinas
  {
    name: 'Médina de Constantine',
    slug: 'medina-constantine',
    type: 'MEDINA',
    wilaya: 'Constantine',
    lat: 36.3650,
    lng: 6.6147,
    coverUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
    gallery: [],
    description: 'Vieille ville perchée avec ponts spectaculaires',
    tags: ['history', 'architecture', 'bridges', 'crafts'],
    ratingAgg: 4.7,
    reviewCount: 378,
    safetyNotes: 'Rues étroites et pentues. Chaussures confortables essentielles.',
  },
  
  // Lacs
  {
    name: 'Lac de Reghaia',
    slug: 'lac-reghaia',
    type: 'LAKE',
    wilaya: 'Alger',
    lat: 36.7500,
    lng: 3.3333,
    coverUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000',
    gallery: [],
    description: 'Réserve naturelle avec oiseaux migrateurs',
    tags: ['birdwatching', 'nature', 'wetland'],
    ratingAgg: 4.3,
    reviewCount: 145,
    safetyNotes: 'Zone protégée. Respecter la faune.',
  },
  
  // Musées
  {
    name: 'Musée National des Beaux-Arts',
    slug: 'musee-beaux-arts',
    type: 'MUSEUM',
    wilaya: 'Alger',
    lat: 36.7525,
    lng: 3.0420,
    coverUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd',
    gallery: [],
    description: 'Plus grande collection d\'art d\'Algérie',
    tags: ['art', 'culture', 'history'],
    ratingAgg: 4.5,
    reviewCount: 267,
    safetyNotes: 'Photos interdites dans certaines salles.',
  },
  {
    name: 'Musée du Bardo',
    slug: 'musee-bardo',
    type: 'MUSEUM',
    wilaya: 'Alger',
    lat: 36.7533,
    lng: 3.0686,
    coverUrl: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4',
    gallery: [],
    description: 'Musée de préhistoire et d\'ethnographie',
    tags: ['prehistory', 'ethnography', 'culture'],
    ratingAgg: 4.6,
    reviewCount: 189,
    safetyNotes: 'Fermé le vendredi. Réservation groupes conseillée.',
  },
  
  // Extras pour atteindre 24+
  {
    name: 'Cap Carbon',
    slug: 'cap-carbon',
    type: 'VIEWPOINT',
    wilaya: 'Béjaïa',
    lat: 36.7700,
    lng: 5.1000,
    coverUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3',
    gallery: [],
    description: 'Phare emblématique avec vue panoramique',
    tags: ['lighthouse', 'panorama', 'hiking'],
    ratingAgg: 4.8,
    reviewCount: 234,
    safetyNotes: 'Sentier escarpé. Éviter par temps venteux.',
  },
  {
    name: 'Gorges de Kherrata',
    slug: 'gorges-kherrata',
    type: 'VIEWPOINT',
    wilaya: 'Béjaïa',
    lat: 36.4667,
    lng: 5.3000,
    coverUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    gallery: [],
    description: 'Canyon vertigineux avec route spectaculaire',
    tags: ['gorge', 'driving', 'nature'],
    ratingAgg: 4.7,
    reviewCount: 156,
    safetyNotes: 'Route étroite. Prudence en conduite.',
  },
  {
    name: 'Fort Santa Cruz',
    slug: 'fort-santa-cruz',
    type: 'HERITAGE',
    wilaya: 'Oran',
    lat: 35.7056,
    lng: -0.6506,
    coverUrl: 'https://images.unsplash.com/photo-1609944431059-9dc8f3aa7a0f',
    gallery: [],
    description: 'Forteresse espagnole dominant la baie d\'Oran',
    tags: ['fort', 'history', 'panorama'],
    ratingAgg: 4.6,
    reviewCount: 289,
    safetyNotes: 'Montée raide. Protection solaire nécessaire.',
  },
]

const DEMO_ITINERARIES = [
  {
    title: 'Côte & Plages d\'Alger',
    description: 'Découvrez les plus belles plages de la côte algéroise',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    durationHint: '1 journée',
    distance: 85,
    seasonality: 'SUMMER' as const,
    difficulty: 'Facile',
    tags: ['beach', 'family', 'swimming'],
    featured: true,
  },
  {
    title: 'Montagnes & Cascades de Kabylie',
    description: 'Randonnée à travers les merveilles naturelles de Kabylie',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    durationHint: '2 jours',
    distance: 180,
    seasonality: 'ALL' as const,
    difficulty: 'Modéré',
    tags: ['hiking', 'nature', 'mountain'],
    featured: true,
  },
  {
    title: 'Patrimoine & Histoire',
    description: 'Circuit culturel à travers les sites UNESCO d\'Algérie',
    coverUrl: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
    durationHint: '3 jours',
    distance: 450,
    seasonality: 'ALL' as const,
    difficulty: 'Facile',
    tags: ['unesco', 'history', 'culture'],
    featured: true,
  },
]

async function main() {
  console.log('🌱 Début du seed de la base de données...')

  // Clean database
  await prisma.placeReview.deleteMany()
  await prisma.itineraryStop.deleteMany()
  await prisma.place.deleteMany()
  await prisma.itinerary.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'passenger@demo.com',
        name: 'Sarah Benali',
        locale: 'fr',
        emailVerified: true,
        roles: ['USER'],
      },
    }),
    prisma.user.create({
      data: {
        email: 'driver@demo.com',
        name: 'Ahmed Khelifi',
        locale: 'fr',
        emailVerified: true,
        roles: ['USER', 'DRIVER'],
        driver: {
          create: {
            licenseNumber: 'DZ123456789',
            kycStatus: 'VERIFIED',
            rating: 4.8,
            tripsCount: 45,
            badges: ['verified', 'top_rated'],
            vehicles: {
              create: {
                make: 'Renault',
                model: 'Symbol',
                year: 2021,
                color: 'Gris',
                seats: 4,
                plate: '16-123-456',
                verified: true,
              },
            },
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@demo.com',
        name: 'Admin SafarGo',
        locale: 'fr',
        emailVerified: true,
        roles: ['USER', 'ADMIN'],
      },
    }),
  ])

  console.log(`✅ ${users.length} utilisateurs créés`)

  // Create places
  const places = await Promise.all(
    DEMO_PLACES.map((place) =>
      prisma.place.create({ data: place }),
    ),
  )

  console.log(`✅ ${places.length} lieux touristiques créés`)

  // Create itineraries with stops
  const itineraries = []
  for (let i = 0; i < DEMO_ITINERARIES.length; i++) {
    const itineraryData = DEMO_ITINERARIES[i]
    const itinerary = await prisma.itinerary.create({
      data: {
        ...itineraryData,
        stops: {
          create: [
            {
              placeId: places[i * 3].id,
              order: 1,
              dwellMin: 120,
            },
            {
              placeId: places[i * 3 + 1].id,
              order: 2,
              dwellMin: 90,
            },
            {
              placeId: places[i * 3 + 2].id,
              order: 3,
              dwellMin: 60,
            },
          ],
        },
      },
    })
    itineraries.push(itinerary)
  }

  console.log(`✅ ${itineraries.length} itinéraires créés`)

  // Create tourism trips
  const driver = users.find((u) => u.email === 'driver@demo.com')
  const driverData = await prisma.driver.findUnique({
    where: { userId: driver!.id },
    include: { vehicles: true },
  })

  const tourismTrips = []
  for (let i = 0; i < 10; i++) {
    const place = places[i]
    const tripDate = new Date()
    tripDate.setDate(tripDate.getDate() + Math.floor(Math.random() * 30) + 1)
    
    const trip = await prisma.trip.create({
      data: {
        driverId: driverData!.id,
        vehicleId: driverData!.vehicles[0].id,
        originLat: 36.7538,
        originLng: 3.0588,
        originLabel: 'Alger Centre',
        destinationLat: place.lat,
        destinationLng: place.lng,
        destinationLabel: place.name,
        dateTime: tripDate,
        seats: 3,
        availableSeats: 3,
        pricePerSeat: 500 + Math.floor(Math.random() * 1000),
        currency: 'DZD',
        rules: ['Non fumeur', 'Bagages légers'],
        status: 'OPEN',
        tourismMode: true,
        placeId: place.id,
      },
    })
    tourismTrips.push(trip)
  }

  console.log(`✅ ${tourismTrips.length} trajets touristiques créés`)

  // Create some reviews
  const reviews = []
  for (let i = 0; i < 5; i++) {
    const review = await prisma.placeReview.create({
      data: {
        userId: users[0].id,
        placeId: places[i].id,
        rating: 4 + Math.random(),
        text: 'Magnifique endroit à visiter ! Je recommande vivement.',
        moderated: true,
      },
    })
    reviews.push(review)
  }

  console.log(`✅ ${reviews.length} avis créés`)

  console.log('✨ Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })