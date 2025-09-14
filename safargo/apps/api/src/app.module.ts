import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from 'nestjs-prisma'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TripsModule } from './trips/trips.module'
import { BookingsModule } from './bookings/bookings.module'
import { PaymentsModule } from './payments/payments.module'
import { MessagesModule } from './messages/messages.module'
import { PlacesModule } from './places/places.module'
import { AdminModule } from './admin/admin.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10,
      },
    ]),

    // Database
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [],
        explicitConnect: true,
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    TripsModule,
    BookingsModule,
    PaymentsModule,
    MessagesModule,
    PlacesModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}