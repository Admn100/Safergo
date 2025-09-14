import { PrismaClient, Wilaya, PlaceType, Season, Difficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateRandomString } from '@safargo/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SafarGo database...');

  // Clean existing data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.placeReview.deleteMany();
    await prisma.itineraryStop.deleteMany();
    await prisma.itinerary.deleteMany();
    await prisma.place.deleteMany();
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.dispute.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.kycDocument.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.otpCode.deleteMany();
    await prisma.userPreferences.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@safargo.com',
      name: 'SafarGo Admin',
      passwordHash: adminPassword,
      roles: ['admin'],
      status: 'active',
      emailVerified: true,
      locale: 'fr',
      userPreferences: {
        create: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          marketingEmails: false,
        },
      },
    },
  });

  // Create demo users
  const users = await Promise.all([
    // Conducteur 1 - Ahmed
    prisma.user.create({
      data: {
        email: 'ahmed.driver@safargo.com',
        name: 'Ahmed Benali',
        phone: '+213555123456',
        passwordHash: await bcrypt.hash('demo123', 12),
        roles: ['user', 'driver'],
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        locale: 'fr',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        userPreferences: {
          create: {},
        },
        driver: {
          create: {
            licenseNumber: 'DZ123456789',
            licenseExpiryDate: new Date('2025-12-31'),
            kycStatus: 'approved',
            badges: ['verified', 'experienced'],
            rating: 4.8,
            reviewCount: 45,
            totalTrips: 52,
            vehicles: {
              create: {
                make: 'Renault',
                model: 'Symbol',
                year: 2020,
                color: 'Blanc',
                seats: 4,
                plate: '16-123-45',
                photos: [
                  'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
                ],
                isVerified: true,
              },
            },
          },
        },
      },
    }),

    // Conducteur 2 - Fatima
    prisma.user.create({
      data: {
        email: 'fatima.driver@safargo.com',
        name: 'Fatima Khelil',
        phone: '+213666987654',
        passwordHash: await bcrypt.hash('demo123', 12),
        roles: ['user', 'driver'],
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        locale: 'ar',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        userPreferences: {
          create: {
            language: 'ar',
          },
        },
        driver: {
          create: {
            licenseNumber: 'DZ987654321',
            licenseExpiryDate: new Date('2026-06-30'),
            kycStatus: 'approved',
            badges: ['verified', 'top_rated'],
            rating: 4.9,
            reviewCount: 38,
            totalTrips: 41,
            vehicles: {
              create: {
                make: 'Peugeot',
                model: '301',
                year: 2021,
                color: 'Gris',
                seats: 4,
                plate: '31-567-89',
                photos: [
                  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
                ],
                isVerified: true,
              },
            },
          },
        },
      },
    }),

    // Passager 1 - Youcef
    prisma.user.create({
      data: {
        email: 'youcef.passenger@safargo.com',
        name: 'Youcef Messaoudi',
        phone: '+213777456123',
        passwordHash: await bcrypt.hash('demo123', 12),
        roles: ['user'],
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        locale: 'fr',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        userPreferences: {
          create: {},
        },
      },
    }),

    // Passager 2 - Amina
    prisma.user.create({
      data: {
        email: 'amina.passenger@safargo.com',
        name: 'Amina Boudiaf',
        phone: '+213888789456',
        passwordHash: await bcrypt.hash('demo123', 12),
        roles: ['user'],
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        locale: 'ar',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        userPreferences: {
          create: {
            language: 'ar',
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length + 1} users (including admin)`);

  // Create Places (POI Algérie)
  const places = await Promise.all([
    // Plages
    prisma.place.create({
      data: {
        name: 'Plage de Sidi Fredj',
        slug: 'plage-sidi-fredj',
        type: 'beach',
        wilaya: 'algiers',
        lat: 36.6589,
        lng: 2.8394,
        coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
        ],
        description: 'Magnifique plage située à l\'ouest d\'Alger, idéale pour les familles avec ses eaux calmes et ses installations touristiques.',
        openHours: '6h00 - 19h00',
        priceHint: 'Gratuit',
        tags: ['family', 'swimming', 'sunset', 'restaurants'],
        ratingAgg: 4.3,
        reviewCount: 127,
        safetyNotes: 'Plage surveillée en été. Attention aux courants près des rochers.',
        accessibility: 'Accessible en fauteuil roulant',
        bestSeason: ['summer', 'spring'],
        difficulty: 'easy',
      },
    }),

    prisma.place.create({
      data: {
        name: 'Plage de Tigzirt',
        slug: 'plage-tigzirt',
        type: 'beach',
        wilaya: 'tizi_ouzou',
        lat: 36.8967,
        lng: 4.1167,
        coverUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
        ],
        description: 'Plage sauvage de Kabylie avec vue panoramique sur la Méditerranée et les montagnes.',
        openHours: 'Toute la journée',
        priceHint: 'Gratuit',
        tags: ['wild', 'panoramic', 'hiking', 'photography'],
        ratingAgg: 4.6,
        reviewCount: 89,
        safetyNotes: 'Plage non surveillée. Prudence recommandée.',
        bestSeason: ['summer', 'spring'],
        difficulty: 'moderate',
      },
    }),

    // Cascades
    prisma.place.create({
      data: {
        name: 'Cascades de Kefrida',
        slug: 'cascades-kefrida',
        type: 'waterfall',
        wilaya: 'bejaia',
        lat: 36.4167,
        lng: 5.0833,
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        ],
        description: 'Spectaculaires cascades au cœur des montagnes de Bejaia, parfaites pour la randonnée et la baignade.',
        openHours: 'Lever au coucher du soleil',
        priceHint: 'Gratuit',
        tags: ['hiking', 'swimming', 'nature', 'photography', 'adventure'],
        ratingAgg: 4.8,
        reviewCount: 156,
        safetyNotes: 'Sentier de randonnée de difficulté moyenne. Chaussures de marche recommandées.',
        accessibility: 'Non accessible en fauteuil roulant',
        bestSeason: ['spring', 'summer', 'autumn'],
        difficulty: 'moderate',
      },
    }),

    // Montagnes
    prisma.place.create({
      data: {
        name: 'Mont Lalla Khadidja',
        slug: 'mont-lalla-khadidja',
        type: 'mountain',
        wilaya: 'tizi_ouzou',
        lat: 36.4667,
        lng: 4.0167,
        coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        ],
        description: 'Point culminant du Djurdjura (2308m), offrant des vues spectaculaires sur la Kabylie.',
        openHours: 'Toute la journée',
        priceHint: 'Gratuit',
        tags: ['hiking', 'panoramic', 'adventure', 'snow', 'photography'],
        ratingAgg: 4.7,
        reviewCount: 203,
        safetyNotes: 'Randonnée difficile. Guide recommandé. Neige possible en hiver.',
        accessibility: 'Non accessible en fauteuil roulant',
        bestSeason: ['spring', 'summer', 'autumn'],
        difficulty: 'hard',
      },
    }),

    // Désert
    prisma.place.create({
      data: {
        name: 'Dunes de Merzouga',
        slug: 'dunes-merzouga',
        type: 'desert',
        wilaya: 'tamanrasset',
        lat: 22.7833,
        lng: 5.6167,
        coverUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
        ],
        description: 'Majestueuses dunes de sable du Sahara algérien, parfaites pour les excursions en 4x4 et bivouacs.',
        openHours: 'Toute la journée',
        priceHint: 'Excursions à partir de 5000 DZD',
        tags: ['desert', '4x4', 'camping', 'stars', 'camel', 'adventure'],
        ratingAgg: 4.9,
        reviewCount: 342,
        safetyNotes: 'Guide obligatoire. Prévoir eau et protection solaire. Températures extrêmes.',
        accessibility: 'Non accessible en fauteuil roulant',
        bestSeason: ['autumn', 'winter', 'spring'],
        difficulty: 'moderate',
      },
    }),

    // Patrimoine
    prisma.place.create({
      data: {
        name: 'Casbah d\'Alger',
        slug: 'casbah-alger',
        type: 'heritage',
        wilaya: 'algiers',
        lat: 36.7853,
        lng: 3.0603,
        coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=600&h=400&fit=crop',
        ],
        description: 'Citadelle historique d\'Alger, classée patrimoine mondial UNESCO, témoin de l\'histoire ottomane.',
        openHours: '9h00 - 17h00',
        priceHint: 'Entrée libre, visites guidées 500 DZD',
        tags: ['history', 'unesco', 'architecture', 'culture', 'guided_tours'],
        ratingAgg: 4.4,
        reviewCount: 567,
        safetyNotes: 'Rues étroites et pavées. Chaussures confortables recommandées.',
        accessibility: 'Partiellement accessible',
        bestSeason: ['all'],
        difficulty: 'easy',
      },
    }),

    // Oasis
    prisma.place.create({
      data: {
        name: 'Oasis de Ghardaïa',
        slug: 'oasis-ghardaia',
        type: 'oasis',
        wilaya: 'ghardaia',
        lat: 32.4911,
        lng: 3.6736,
        coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop',
        ],
        description: 'Oasis du M\'Zab avec son architecture unique et ses jardins de palmiers dattiers.',
        openHours: '8h00 - 18h00',
        priceHint: 'Visite guidée 1000 DZD',
        tags: ['oasis', 'architecture', 'dates', 'culture', 'unesco'],
        ratingAgg: 4.6,
        reviewCount: 234,
        safetyNotes: 'Respecter les traditions locales. Tenue vestimentaire appropriée.',
        accessibility: 'Accessible en fauteuil roulant',
        bestSeason: ['autumn', 'winter', 'spring'],
        difficulty: 'easy',
      },
    }),

    // Lacs
    prisma.place.create({
      data: {
        name: 'Lac de Bin El Ouidane',
        slug: 'lac-bin-el-ouidane',
        type: 'lake',
        wilaya: 'bouira',
        lat: 36.0167,
        lng: 3.9167,
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        ],
        description: 'Magnifique lac de barrage entouré de montagnes, idéal pour la pêche et les activités nautiques.',
        openHours: 'Toute la journée',
        priceHint: 'Gratuit, location barque 2000 DZD/h',
        tags: ['fishing', 'boating', 'picnic', 'family', 'nature'],
        ratingAgg: 4.2,
        reviewCount: 98,
        safetyNotes: 'Surveillance recommandée pour les enfants près de l\'eau.',
        accessibility: 'Accessible en fauteuil roulant',
        bestSeason: ['spring', 'summer', 'autumn'],
        difficulty: 'easy',
      },
    }),
  ]);

  console.log(`✅ Created ${places.length} places`);

  // Create Itineraries
  const itineraries = await Promise.all([
    prisma.itinerary.create({
      data: {
        title: 'Côte et Plages d\'Algérie',
        slug: 'cote-plages-algerie',
        description: 'Découvrez les plus belles plages de la côte algérienne, de Sidi Fredj à Tigzirt.',
        coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        durationHint: '2-3 jours',
        seasonality: 'summer',
        difficulty: 'easy',
        tags: ['beach', 'family', 'swimming', 'relaxation'],
        estimatedCost: '8000-15000 DZD par personne',
        stops: {
          create: [
            {
              placeId: places.find(p => p.slug === 'plage-sidi-fredj')!.id,
              order: 1,
              dwellMinutes: 180,
              notes: 'Déjeuner et baignade sur la plage',
            },
            {
              placeId: places.find(p => p.slug === 'plage-tigzirt')!.id,
              order: 2,
              dwellMinutes: 240,
              notes: 'Nuit sur place, coucher de soleil',
            },
          ],
        },
      },
    }),

    prisma.itinerary.create({
      data: {
        title: 'Montagnes et Cascades de Kabylie',
        slug: 'montagnes-cascades-kabylie',
        description: 'Aventure en montagne avec randonnées, cascades et panoramas exceptionnels.',
        coverUrl: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=800&h=600&fit=crop',
        durationHint: '3-4 jours',
        seasonality: 'spring',
        difficulty: 'moderate',
        tags: ['hiking', 'nature', 'adventure', 'photography'],
        estimatedCost: '12000-20000 DZD par personne',
        stops: {
          create: [
            {
              placeId: places.find(p => p.slug === 'cascades-kefrida')!.id,
              order: 1,
              dwellMinutes: 300,
              notes: 'Randonnée et baignade aux cascades',
            },
            {
              placeId: places.find(p => p.slug === 'mont-lalla-khadidja')!.id,
              order: 2,
              dwellMinutes: 480,
              notes: 'Ascension et nuit en montagne',
            },
          ],
        },
      },
    }),

    prisma.itinerary.create({
      data: {
        title: 'Patrimoine et Culture Algéroise',
        slug: 'patrimoine-culture-alger',
        description: 'Immersion dans l\'histoire et la culture d\'Alger, de la Casbah aux musées.',
        coverUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800&h=600&fit=crop',
        durationHint: '1-2 jours',
        seasonality: 'all',
        difficulty: 'easy',
        tags: ['culture', 'history', 'architecture', 'unesco'],
        estimatedCost: '5000-10000 DZD par personne',
        stops: {
          create: [
            {
              placeId: places.find(p => p.slug === 'casbah-alger')!.id,
              order: 1,
              dwellMinutes: 240,
              notes: 'Visite guidée complète de la Casbah',
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${itineraries.length} itineraries`);

  // Create Tourism Trips
  const driver1 = users.find(u => u.email === 'ahmed.driver@safargo.com')!;
  const driver2 = users.find(u => u.email === 'fatima.driver@safargo.com')!;
  const driver1Vehicle = await prisma.vehicle.findFirst({ where: { driverId: driver1.driver!.id } });
  const driver2Vehicle = await prisma.vehicle.findFirst({ where: { driverId: driver2.driver!.id } });

  const trips = await Promise.all([
    // Trip to Sidi Fredj Beach
    prisma.trip.create({
      data: {
        driverId: driver1.driver!.id,
        vehicleId: driver1Vehicle!.id,
        originLat: 36.7538,
        originLng: 3.0588,
        originLabel: 'Centre-ville Alger',
        originCity: 'Alger',
        destinationLat: 36.6589,
        destinationLng: 2.8394,
        destinationLabel: 'Plage de Sidi Fredj',
        destinationCity: 'Sidi Fredj',
        departureDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        availableSeats: 3,
        pricePerSeat: 800,
        status: 'open',
        description: 'Trajet vers la magnifique plage de Sidi Fredj pour une journée détente !',
        placeId: places.find(p => p.slug === 'plage-sidi-fredj')!.id,
        tourismMode: true,
        totalDistance: 35,
        estimatedDuration: 45,
        smokingAllowed: false,
        petsAllowed: false,
        musicAllowed: true,
        conversationLevel: 'normal',
        luggageSize: 'small',
        publishedAt: new Date(),
      },
    }),

    // Trip to Kefrida Waterfalls
    prisma.trip.create({
      data: {
        driverId: driver2.driver!.id,
        vehicleId: driver2Vehicle!.id,
        originLat: 36.7500,
        originLng: 5.0667,
        originLabel: 'Centre-ville Bejaia',
        originCity: 'Bejaia',
        destinationLat: 36.4167,
        destinationLng: 5.0833,
        destinationLabel: 'Cascades de Kefrida',
        destinationCity: 'Kefrida',
        departureDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
        availableSeats: 2,
        pricePerSeat: 1200,
        status: 'open',
        description: 'Aventure aux cascades de Kefrida - randonnée et baignade au programme !',
        placeId: places.find(p => p.slug === 'cascades-kefrida')!.id,
        tourismMode: true,
        totalDistance: 45,
        estimatedDuration: 75,
        smokingAllowed: false,
        petsAllowed: false,
        musicAllowed: true,
        conversationLevel: 'chatty',
        luggageSize: 'medium',
        publishedAt: new Date(),
      },
    }),

    // Regular carpooling trip
    prisma.trip.create({
      data: {
        driverId: driver1.driver!.id,
        vehicleId: driver1Vehicle!.id,
        originLat: 36.7538,
        originLng: 3.0588,
        originLabel: 'Alger Centre',
        originCity: 'Alger',
        destinationLat: 36.1833,
        destinationLng: 5.4167,
        destinationLabel: 'Constantine',
        destinationCity: 'Constantine',
        departureDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
        availableSeats: 3,
        pricePerSeat: 2500,
        status: 'open',
        description: 'Trajet régulier Alger-Constantine, départ matinal.',
        tourismMode: false,
        totalDistance: 431,
        estimatedDuration: 300,
        smokingAllowed: false,
        petsAllowed: false,
        musicAllowed: true,
        conversationLevel: 'normal',
        luggageSize: 'large',
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${trips.length} trips`);

  // Create some bookings
  const passenger1 = users.find(u => u.email === 'youcef.passenger@safargo.com')!;
  const passenger2 = users.find(u => u.email === 'amina.passenger@safargo.com')!;

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        tripId: trips[0].id,
        userId: passenger1.id,
        seats: 2,
        priceTotal: 1600,
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    }),

    prisma.booking.create({
      data: {
        tripId: trips[1].id,
        userId: passenger2.id,
        seats: 1,
        priceTotal: 1200,
        status: 'held',
      },
    }),
  ]);

  console.log(`✅ Created ${bookings.length} bookings`);

  // Create some place reviews
  const placeReviews = await Promise.all([
    prisma.placeReview.create({
      data: {
        userId: passenger1.id,
        placeId: places.find(p => p.slug === 'plage-sidi-fredj')!.id,
        rating: 5,
        text: 'Magnifique plage ! Parfaite pour une sortie en famille. L\'eau est claire et les installations sont propres.',
        photos: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
        ],
        moderated: true,
      },
    }),

    prisma.placeReview.create({
      data: {
        userId: passenger2.id,
        placeId: places.find(p => p.slug === 'cascades-kefrida')!.id,
        rating: 5,
        text: 'مكان رائع للغاية! الشلالات جميلة والمشي ممتع. ننصح بأحذية مريحة للمشي.',
        moderated: true,
      },
    }),
  ]);

  console.log(`✅ Created ${placeReviews.length} place reviews`);

  // Create app config
  await prisma.appConfig.createMany({
    data: [
      {
        key: 'maintenance_mode',
        value: false,
        description: 'Enable maintenance mode',
      },
      {
        key: 'max_booking_days_advance',
        value: 30,
        description: 'Maximum days in advance for booking',
      },
      {
        key: 'commission_rate',
        value: 0.05,
        description: 'Platform commission rate (5%)',
      },
      {
        key: 'supported_currencies',
        value: ['DZD', 'EUR', 'USD'],
        description: 'Supported currencies',
      },
    ],
  });

  console.log('✅ Created app configuration');

  // Update place ratings based on reviews
  for (const place of places) {
    const reviews = await prisma.placeReview.findMany({
      where: { placeId: place.id },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await prisma.place.update({
        where: { id: place.id },
        data: {
          ratingAgg: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      });
    }
  }

  console.log('✅ Updated place ratings');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${users.length + 1} (including admin)`);
  console.log(`🚗 Drivers: 2`);
  console.log(`🏛️ Places: ${places.length}`);
  console.log(`🗺️ Itineraries: ${itineraries.length}`);
  console.log(`🚙 Trips: ${trips.length}`);
  console.log(`📝 Bookings: ${bookings.length}`);
  console.log(`⭐ Place Reviews: ${placeReviews.length}`);
  
  console.log('\n🔑 Demo Accounts:');
  console.log('Admin: admin@safargo.com / admin123');
  console.log('Driver 1: ahmed.driver@safargo.com / demo123');
  console.log('Driver 2: fatima.driver@safargo.com / demo123');
  console.log('Passenger 1: youcef.passenger@safargo.com / demo123');
  console.log('Passenger 2: amina.passenger@safargo.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });