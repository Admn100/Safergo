import { PrismaClient, Role, KycStatus, TripStatus, BookingStatus, PaymentStatus, PlaceType, Seasonality } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🇩🇿 Starting SafarGo Algeria seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@safargo.com' },
    update: {},
    create: {
      email: 'admin@safargo.com',
      name: 'Admin SafarGo',
      phone: '+213555000001',
      roles: [Role.ADMIN, Role.DRIVER],
      locale: 'fr',
    },
  })

  // Create demo drivers
  const driver1 = await prisma.user.upsert({
    where: { email: 'ahmed@safargo.com' },
    update: {},
    create: {
      email: 'ahmed@safargo.com',
      name: 'Ahmed Benali',
      phone: '+213555000002',
      roles: [Role.DRIVER],
      locale: 'fr',
    },
  })

  const driver2 = await prisma.user.upsert({
    where: { email: 'fatima@safargo.com' },
    update: {},
    create: {
      email: 'fatima@safargo.com',
      name: 'Fatima Zohra',
      phone: '+213555000003',
      roles: [Role.DRIVER],
      locale: 'ar',
    },
  })

  const driver3 = await prisma.user.upsert({
    where: { email: 'youssef@safargo.com' },
    update: {},
    create: {
      email: 'youssef@safargo.com',
      name: 'Youssef Khelil',
      phone: '+213555000004',
      roles: [Role.DRIVER],
      locale: 'fr',
    },
  })

  // Create demo passengers
  const passenger1 = await prisma.user.upsert({
    where: { email: 'amina@safargo.com' },
    update: {},
    create: {
      email: 'amina@safargo.com',
      name: 'Amina Boudjedra',
      phone: '+213555000005',
      roles: [Role.USER],
      locale: 'ar',
    },
  })

  const passenger2 = await prisma.user.upsert({
    where: { email: 'karim@safargo.com' },
    update: {},
    create: {
      email: 'karim@safargo.com',
      name: 'Karim Belkacem',
      phone: '+213555000006',
      roles: [Role.USER],
      locale: 'fr',
    },
  })

  // Create driver profiles
  const driverProfile1 = await prisma.driver.upsert({
    where: { userId: driver1.id },
    update: {},
    create: {
      userId: driver1.id,
      kycStatus: KycStatus.APPROVED,
      licenseNumber: 'DZ123456789',
      badges: ['verified', 'top-rated', 'tourism-expert'],
    },
  })

  const driverProfile2 = await prisma.driver.upsert({
    where: { userId: driver2.id },
    update: {},
    create: {
      userId: driver2.id,
      kycStatus: KycStatus.APPROVED,
      licenseNumber: 'DZ987654321',
      badges: ['verified', 'family-friendly'],
    },
  })

  const driverProfile3 = await prisma.driver.upsert({
    where: { userId: driver3.id },
    update: {},
    create: {
      userId: driver3.id,
      kycStatus: KycStatus.APPROVED,
      licenseNumber: 'DZ456789123',
      badges: ['verified', 'long-distance'],
    },
  })

  // Create vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      driverId: driverProfile1.id,
      make: 'Renault',
      model: 'Clio IV',
      year: 2020,
      color: 'Blanc',
      seats: 4,
      plate: '12345-A-16',
      photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'],
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      driverId: driverProfile2.id,
      make: 'Peugeot',
      model: '208',
      year: 2019,
      color: 'Rouge',
      seats: 4,
      plate: '67890-B-16',
      photos: ['https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop'],
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      driverId: driverProfile3.id,
      make: 'Hyundai',
      model: 'Tucson',
      year: 2021,
      color: 'Gris',
      seats: 5,
      plate: '11111-C-16',
      photos: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'],
    },
  })

  // Create tourism places (24+ POI across Algeria)
  const places = [
    // Beaches - Alger
    {
      name: 'Plage de Sidi Fredj',
      slug: 'plage-sidi-fredj',
      type: PlaceType.BEACH,
      wilaya: 'Alger',
      coords: { lat: 36.7556, lng: 2.8572 },
      coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['family', 'sunset', 'restaurants'],
      ratingAgg: 4.6,
      reviewCount: 128,
      safetyNotes: 'Plage surveillée en été, attention aux courants forts',
    },
    {
      name: 'Plage de Zeralda',
      slug: 'plage-zeralda',
      type: PlaceType.BEACH,
      wilaya: 'Alger',
      coords: { lat: 36.7167, lng: 2.8333 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['family', 'calm', 'nature'],
      ratingAgg: 4.4,
      reviewCount: 89,
      safetyNotes: 'Plage familiale, eau claire',
    },
    {
      name: 'Plage de Tipaza',
      slug: 'plage-tipaza',
      type: PlaceType.BEACH,
      wilaya: 'Tipaza',
      coords: { lat: 36.5833, lng: 2.4500 },
      coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop'
      ],
      tags: ['historical', 'ruins', 'sunset'],
      ratingAgg: 4.8,
      reviewCount: 156,
      safetyNotes: 'Site historique, respecter les vestiges',
    },
    {
      name: 'Plage de Jijel',
      slug: 'plage-jijel',
      type: PlaceType.BEACH,
      wilaya: 'Jijel',
      coords: { lat: 36.8206, lng: 5.7661 },
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'
      ],
      tags: ['nature', 'mountains', 'crystal-clear'],
      ratingAgg: 4.7,
      reviewCount: 203,
      safetyNotes: 'Eau cristalline, attention aux rochers',
    },

    // Waterfalls - Jijel
    {
      name: 'Cascades de Kefrida',
      slug: 'cascades-kefrida',
      type: PlaceType.WATERFALL,
      wilaya: 'Jijel',
      coords: { lat: 36.7500, lng: 5.8000 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['hiking', 'nature', 'photography'],
      ratingAgg: 4.9,
      reviewCount: 95,
      safetyNotes: 'Sentier glissant, chaussures de randonnée recommandées',
    },
    {
      name: 'Cascades d\'El Kala',
      slug: 'cascades-el-kala',
      type: PlaceType.WATERFALL,
      wilaya: 'El Tarf',
      coords: { lat: 36.9000, lng: 8.4333 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['nature', 'park', 'wildlife'],
      ratingAgg: 4.5,
      reviewCount: 67,
      safetyNotes: 'Dans le parc national, respecter la faune',
    },

    // Mountains - Kabylie
    {
      name: 'Djurdjura',
      slug: 'djurdjura',
      type: PlaceType.MOUNTAIN,
      wilaya: 'Tizi Ouzou',
      coords: { lat: 36.4500, lng: 4.2000 },
      coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=800&h=600&fit=crop'
      ],
      tags: ['hiking', 'skiing', 'nature'],
      ratingAgg: 4.8,
      reviewCount: 134,
      safetyNotes: 'Altitude élevée, équipement de montagne nécessaire',
    },
    {
      name: 'Chréa',
      slug: 'chrea',
      type: PlaceType.MOUNTAIN,
      wilaya: 'Blida',
      coords: { lat: 36.4167, lng: 2.8833 },
      coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=800&h=600&fit=crop'
      ],
      tags: ['skiing', 'hiking', 'forest'],
      ratingAgg: 4.6,
      reviewCount: 112,
      safetyNotes: 'Station de ski, vérifier les conditions météo',
    },
    {
      name: 'Aurès',
      slug: 'aures',
      type: PlaceType.MOUNTAIN,
      wilaya: 'Batna',
      coords: { lat: 35.3333, lng: 6.1667 },
      coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=800&h=600&fit=crop'
      ],
      tags: ['hiking', 'berber', 'history'],
      ratingAgg: 4.7,
      reviewCount: 89,
      safetyNotes: 'Région berbère, respecter les traditions locales',
    },

    // Desert - Sahara
    {
      name: 'Grand Erg Oriental',
      slug: 'grand-erg-oriental',
      type: PlaceType.DESERT,
      wilaya: 'Ouargla',
      coords: { lat: 30.0000, lng: 6.0000 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['desert', 'sand-dunes', 'adventure'],
      ratingAgg: 4.9,
      reviewCount: 78,
      safetyNotes: 'Désert dangereux, guide local obligatoire',
    },
    {
      name: 'Tassili N\'Ajjer',
      slug: 'tassili-najjer',
      type: PlaceType.DESERT,
      wilaya: 'Illizi',
      coords: { lat: 25.5000, lng: 8.0000 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['rock-art', 'prehistoric', 'unesco'],
      ratingAgg: 4.8,
      reviewCount: 45,
      safetyNotes: 'Site UNESCO, art rupestre fragile',
    },

    // Heritage - UNESCO
    {
      name: 'Casbah d\'Alger',
      slug: 'casbah-alger',
      type: PlaceType.HERITAGE,
      wilaya: 'Alger',
      coords: { lat: 36.7833, lng: 3.0667 },
      coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop'
      ],
      tags: ['unesco', 'history', 'architecture'],
      ratingAgg: 4.5,
      reviewCount: 234,
      safetyNotes: 'Site UNESCO, respecter l\'architecture historique',
    },
    {
      name: 'Timgad',
      slug: 'timgad',
      type: PlaceType.HERITAGE,
      wilaya: 'Batna',
      coords: { lat: 35.4833, lng: 6.4667 },
      coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop'
      ],
      tags: ['roman', 'ruins', 'unesco'],
      ratingAgg: 4.7,
      reviewCount: 156,
      safetyNotes: 'Vestiges romains, ne pas toucher aux pierres',
    },
    {
      name: 'Djemila',
      slug: 'djemila',
      type: PlaceType.HERITAGE,
      wilaya: 'Sétif',
      coords: { lat: 36.3167, lng: 5.7333 },
      coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop'
      ],
      tags: ['roman', 'mosaics', 'unesco'],
      ratingAgg: 4.6,
      reviewCount: 123,
      safetyNotes: 'Mosaïques fragiles, visite guidée recommandée',
    },

    // Food & Gastronomy
    {
      name: 'Marché de la Casbah',
      slug: 'marche-casbah',
      type: PlaceType.FOOD,
      wilaya: 'Alger',
      coords: { lat: 36.7833, lng: 3.0667 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['spices', 'traditional', 'local'],
      ratingAgg: 4.3,
      reviewCount: 89,
      safetyNotes: 'Marché animé, attention aux pickpockets',
    },
    {
      name: 'Restaurant El Dey',
      slug: 'restaurant-el-dey',
      type: PlaceType.FOOD,
      wilaya: 'Alger',
      coords: { lat: 36.7667, lng: 3.0500 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['traditional', 'couscous', 'tagine'],
      ratingAgg: 4.4,
      reviewCount: 67,
      safetyNotes: 'Cuisine traditionnelle, réservation recommandée',
    },

    // Parks & Nature
    {
      name: 'Parc National de Gouraya',
      slug: 'parc-gouraya',
      type: PlaceType.PARK,
      wilaya: 'Béjaïa',
      coords: { lat: 36.7500, lng: 5.0833 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['nature', 'hiking', 'wildlife'],
      ratingAgg: 4.6,
      reviewCount: 98,
      safetyNotes: 'Parc national, respecter la faune et flore',
    },
    {
      name: 'Parc National d\'El Kala',
      slug: 'parc-el-kala',
      type: PlaceType.PARK,
      wilaya: 'El Tarf',
      coords: { lat: 36.9000, lng: 8.4333 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['wetlands', 'birds', 'nature'],
      ratingAgg: 4.5,
      reviewCount: 76,
      safetyNotes: 'Zone humide, jumelles recommandées pour l\'observation',
    },

    // Oasis - Sahara
    {
      name: 'Oasis de Timimoun',
      slug: 'oasis-timimoun',
      type: PlaceType.OASIS,
      wilaya: 'Adrar',
      coords: { lat: 29.2500, lng: 0.2500 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['oasis', 'palms', 'traditional'],
      ratingAgg: 4.7,
      reviewCount: 54,
      safetyNotes: 'Oasis fragile, respecter l\'écosystème',
    },
    {
      name: 'Oasis de Ghardaïa',
      slug: 'oasis-ghardaia',
      type: PlaceType.OASIS,
      wilaya: 'Ghardaïa',
      coords: { lat: 32.4833, lng: 3.6667 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['ksar', 'mzab', 'unesco'],
      ratingAgg: 4.8,
      reviewCount: 87,
      safetyNotes: 'Architecture Mzab, respecter les traditions locales',
    },

    // Medina - Villes historiques
    {
      name: 'Médina de Constantine',
      slug: 'medina-constantine',
      type: PlaceType.MEDINA,
      wilaya: 'Constantine',
      coords: { lat: 36.3667, lng: 6.6167 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['history', 'architecture', 'bridges'],
      ratingAgg: 4.4,
      reviewCount: 112,
      safetyNotes: 'Ville des ponts, attention aux hauteurs',
    },
    {
      name: 'Médina de Tlemcen',
      slug: 'medina-tlemcen',
      type: PlaceType.MEDINA,
      wilaya: 'Tlemcen',
      coords: { lat: 34.8833, lng: -1.3167 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['andalusian', 'history', 'mosques'],
      ratingAgg: 4.6,
      reviewCount: 95,
      safetyNotes: 'Patrimoine andalou, respecter les lieux de culte',
    },

    // Lakes
    {
      name: 'Lac de Reghaïa',
      slug: 'lac-reghaia',
      type: PlaceType.LAKE,
      wilaya: 'Alger',
      coords: { lat: 36.7667, lng: 3.3500 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['nature', 'birds', 'peaceful'],
      ratingAgg: 4.2,
      reviewCount: 43,
      safetyNotes: 'Zone humide, observation des oiseaux',
    },

    // Viewpoints
    {
      name: 'Notre Dame d\'Afrique',
      slug: 'notre-dame-afrique',
      type: PlaceType.VIEWPOINT,
      wilaya: 'Alger',
      coords: { lat: 36.8000, lng: 3.0333 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['viewpoint', 'religious', 'panorama'],
      ratingAgg: 4.5,
      reviewCount: 178,
      safetyNotes: 'Vue panoramique, attention aux bords',
    },
    {
      name: 'Pont Sidi M\'Cid',
      slug: 'pont-sidi-mcid',
      type: PlaceType.VIEWPOINT,
      wilaya: 'Constantine',
      coords: { lat: 36.3667, lng: 6.6167 },
      coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      tags: ['bridge', 'viewpoint', 'architecture'],
      ratingAgg: 4.7,
      reviewCount: 134,
      safetyNotes: 'Pont suspendu, ne pas s\'approcher des bords',
    },
  ]

  const createdPlaces = []
  for (const place of places) {
    const created = await prisma.place.upsert({
      where: { slug: place.slug },
      update: {},
      create: place,
    })
    createdPlaces.push(created)
  }

  // Create itineraries
  const itinerary1 = await prisma.itinerary.create({
    data: {
      title: 'Côte & Plages d\'Alger',
      description: 'Découvrez les plus belles plages de la région d\'Alger, de Sidi Fredj à Tipaza en passant par Zeralda. Une escapade parfaite pour les familles et les amoureux de la mer.',
      coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      durationHint: '1-2 jours',
      seasonality: Seasonality.SUMMER,
      difficulty: 'Facile',
      tags: ['family', 'sea', 'relaxation'],
      stops: {
        create: [
          { placeId: createdPlaces[0].id, order: 1, dwellMin: 120 }, // Sidi Fredj
          { placeId: createdPlaces[1].id, order: 2, dwellMin: 90 },  // Zeralda
          { placeId: createdPlaces[2].id, order: 3, dwellMin: 180 }, // Tipaza
        ],
      },
    },
  })

  const itinerary2 = await prisma.itinerary.create({
    data: {
      title: 'Montagnes & Cascades de Kabylie',
      description: 'Explorez les montagnes de Kabylie et ses cascades spectaculaires, de Djurdjura aux cascades de Kefrida. Une aventure pour les amateurs de nature et de randonnée.',
      coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0b1b?w=800&h=600&fit=crop',
      durationHint: '3-4 jours',
      seasonality: Seasonality.ALL,
      difficulty: 'Moyen',
      tags: ['hiking', 'nature', 'adventure'],
      stops: {
        create: [
          { placeId: createdPlaces[6].id, order: 1, dwellMin: 240 }, // Djurdjura
          { placeId: createdPlaces[4].id, order: 2, dwellMin: 120 }, // Kefrida
          { placeId: createdPlaces[3].id, order: 3, dwellMin: 90 },  // Jijel
        ],
      },
    },
  })

  const itinerary3 = await prisma.itinerary.create({
    data: {
      title: 'Patrimoine & Médinas du Nord',
      description: 'Voyagez dans l\'histoire de l\'Algérie à travers ses sites patrimoniaux et médinas millénaires. Découvrez l\'héritage romain, ottoman et andalou.',
      coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&h=600&fit=crop',
      durationHint: '5-7 jours',
      seasonality: Seasonality.ALL,
      difficulty: 'Facile',
      tags: ['history', 'culture', 'unesco'],
      stops: {
        create: [
          { placeId: createdPlaces[11].id, order: 1, dwellMin: 180 }, // Casbah
          { placeId: createdPlaces[12].id, order: 2, dwellMin: 240 }, // Timgad
          { placeId: createdPlaces[13].id, order: 3, dwellMin: 180 }, // Djemila
          { placeId: createdPlaces[20].id, order: 4, dwellMin: 120 }, // Constantine
        ],
      },
    },
  })

  // Create tourism trips
  const tourismTrips = [
    {
      driverId: driverProfile1.id,
      vehicleId: vehicle1.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' },
      destination: { lat: 36.5833, lng: 2.4500, label: 'Tipaza' },
      dateTime: new Date('2024-06-15T08:00:00Z'),
      seats: 3,
      pricePerSeat: 500,
      rules: ['Non-fumeur', 'Bagages légers'],
      status: TripStatus.OPEN,
      placeId: createdPlaces[2].id, // Tipaza
    },
    {
      driverId: driverProfile2.id,
      vehicleId: vehicle2.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' },
      destination: { lat: 36.4500, lng: 4.2000, label: 'Djurdjura' },
      dateTime: new Date('2024-06-20T07:00:00Z'),
      seats: 2,
      pricePerSeat: 800,
      rules: ['Équipement de randonnée', 'Départ matinal'],
      status: TripStatus.OPEN,
      placeId: createdPlaces[6].id, // Djurdjura
    },
    {
      driverId: driverProfile3.id,
      vehicleId: vehicle3.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' },
      destination: { lat: 35.4833, lng: 6.4667, label: 'Timgad' },
      dateTime: new Date('2024-07-01T06:00:00Z'),
      seats: 3,
      pricePerSeat: 1200,
      rules: ['Voyage longue distance', 'Arrêts possibles'],
      status: TripStatus.OPEN,
      placeId: createdPlaces[12].id, // Timgad
    },
    {
      driverId: driverProfile1.id,
      vehicleId: vehicle1.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' },
      destination: { lat: 36.8206, lng: 5.7661, label: 'Jijel' },
      dateTime: new Date('2024-07-10T09:00:00Z'),
      seats: 2,
      pricePerSeat: 600,
      rules: ['Plage', 'Maillot de bain'],
      status: TripStatus.OPEN,
      placeId: createdPlaces[3].id, // Jijel
    },
    {
      driverId: driverProfile2.id,
      vehicleId: vehicle2.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' },
      destination: { lat: 36.7500, lng: 5.8000, label: 'Cascades de Kefrida' },
      dateTime: new Date('2024-07-15T08:30:00Z'),
      seats: 3,
      pricePerSeat: 700,
      rules: ['Randonnée', 'Chaussures de marche'],
      status: TripStatus.OPEN,
      placeId: createdPlaces[4].id, // Kefrida
    },
  ]

  for (const trip of tourismTrips) {
    await prisma.trip.create({
      data: trip,
    })
  }

  // Create regular trips
  const regularTrips = [
    {
      driverId: driverProfile1.id,
      vehicleId: vehicle1.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 36.3667, lng: 6.6167, label: 'Constantine' },
      dateTime: new Date('2024-06-10T14:00:00Z'),
      seats: 2,
      pricePerSeat: 1500,
      rules: ['Non-fumeur', 'Bagages légers'],
      status: TripStatus.OPEN,
    },
    {
      driverId: driverProfile2.id,
      vehicleId: vehicle2.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 35.3333, lng: 6.1667, label: 'Batna' },
      dateTime: new Date('2024-06-12T09:00:00Z'),
      seats: 3,
      pricePerSeat: 1000,
      rules: ['Arrêts possibles', 'Musique autorisée'],
      status: TripStatus.OPEN,
    },
    {
      driverId: driverProfile3.id,
      vehicleId: vehicle3.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 35.7000, lng: -0.6333, label: 'Oran' },
      dateTime: new Date('2024-06-14T16:00:00Z'),
      seats: 2,
      pricePerSeat: 1800,
      rules: ['Voyage confortable', 'Arrêts repas'],
      status: TripStatus.OPEN,
    },
    {
      driverId: driverProfile1.id,
      vehicleId: vehicle1.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 36.7500, lng: 5.0833, label: 'Béjaïa' },
      dateTime: new Date('2024-06-16T11:00:00Z'),
      seats: 3,
      pricePerSeat: 800,
      rules: ['Côte', 'Arrêts photos'],
      status: TripStatus.OPEN,
    },
    {
      driverId: driverProfile2.id,
      vehicleId: vehicle2.id,
      origin: { lat: 36.7833, lng: 3.0667, label: 'Alger' },
      destination: { lat: 36.3167, lng: 5.7333, label: 'Sétif' },
      dateTime: new Date('2024-06-18T13:00:00Z'),
      seats: 2,
      pricePerSeat: 900,
      rules: ['Patrimoine', 'Visite guidée'],
      status: TripStatus.OPEN,
    },
  ]

  for (const trip of regularTrips) {
    await prisma.trip.create({
      data: trip,
    })
  }

  console.log('✅ SafarGo Algeria seed completed successfully!')
  console.log(`👥 Created ${5} users (1 admin, 3 drivers, 2 passengers)`)
  console.log(`🚗 Created ${3} vehicles`)
  console.log(`📍 Created ${24} tourism places across Algeria`)
  console.log(`🗺️ Created ${3} thematic itineraries`)
  console.log(`🚙 Created ${10} trips (5 tourism, 5 regular)`)
  console.log(`🏛️ Heritage sites: Casbah, Timgad, Djemila`)
  console.log(`🏖️ Beaches: Sidi Fredj, Zeralda, Tipaza, Jijel`)
  console.log(`⛰️ Mountains: Djurdjura, Chréa, Aurès`)
  console.log(`🏜️ Desert: Grand Erg Oriental, Tassili N'Ajjer`)
  console.log(`🌊 Waterfalls: Kefrida, El Kala`)
  console.log(`🌴 Oasis: Timimoun, Ghardaïa`)
  console.log(`🏘️ Medinas: Constantine, Tlemcen`)
  console.log(`🍽️ Food: Marché Casbah, Restaurant El Dey`)
  console.log(`🌳 Parks: Gouraya, El Kala`)
  console.log(`🏞️ Lakes: Reghaïa`)
  console.log(`🌅 Viewpoints: Notre Dame d'Afrique, Pont Sidi M'Cid`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })