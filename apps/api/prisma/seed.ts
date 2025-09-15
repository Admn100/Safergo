import { PrismaClient } from '@prisma/client';
// import { seedAlgeria } from './seed-algeria';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.placeReview.deleteMany();
  await prisma.place.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create demo users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@safargo.com',
      password: '$2a$10$example.hash.for.admin',
      name: 'Admin SafarGo',
      phone: '+213555000001',
      locale: 'fr',
      roles: ['ADMIN'],
      // emailVerified: true,
      // phoneVerified: true,
    },
  });

  const driverUser = await prisma.user.create({
    data: {
      email: 'ahmed@safargo.com',
      password: '$2a$10$example.hash.for.driver',
      name: 'Ahmed Benali',
      phone: '+213555000002',
      locale: 'ar',
      roles: ['DRIVER'],
      // emailVerified: true,
      // phoneVerified: true,
    },
  });

  const passengerUser = await prisma.user.create({
    data: {
      email: 'amina@safargo.com',
      password: '$2a$10$example.hash.for.passenger',
      name: 'Amina Khelil',
      phone: '+213555000003',
      locale: 'fr',
      roles: ['USER'],
      // emailVerified: true,
      // phoneVerified: true,
    },
  });

  console.log('👥 Created demo users');

  // Create driver profile
  const driver = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      kycStatus: 'APPROVED',
      licenseNumber: 'AL123456789',
      badges: ['VERIFIED', 'PREMIUM'],
    },
  });

  // Create vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      driverId: driver.id,
      make: 'Renault',
      model: 'Clio IV',
      year: 2019,
      color: 'Blanc',
      seats: 4,
      plate: '12345-A-16',
      photos: ['https://example.com/vehicle1.jpg'],
    },
  });

  console.log('🚗 Created driver and vehicle');

  // Seed Algeria tourism data
  // await seedAlgeria(prisma);

  console.log('🇩🇿 Seeded Algeria tourism data');

  // Create some demo trips
  const places = await prisma.place.findMany({ take: 3 });
  
  for (let i = 0; i < 3; i++) {
    const place = places[i];
    if (place) {
      await prisma.trip.create({
        data: {
          driverId: driver.id,
          vehicleId: vehicle?.id,
          origin: {
            lat: 36.7372,
            lng: 3.0869,
            label: 'Alger Centre',
            address: 'Place des Martyrs, Alger',
          },
          destination: {
            lat: (place.coords as any).lat,
            lng: (place.coords as any).lng,
            label: place.name,
            address: `${place.name}, ${place.wilaya}`,
          },
          dateTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          seats: 3,
          pricePerSeat: 500 + i * 100,
          rules: ['Pas de fumeur', 'Musique douce autorisée'],
          status: 'OPEN',
          placeId: place.id,
        } as any,
      });
    }
  }

  console.log('🚗 Created demo tourism trips');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Demo accounts:');
  console.log('👑 Admin: admin@safargo.com');
  console.log('🚗 Driver: ahmed@safargo.com');
  console.log('👤 Passenger: amina@safargo.com');
  console.log('\n🇩🇿 SafarGo is ready!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });