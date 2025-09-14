import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  )

  // CORS
  app.enableCors({
    origin: config.get('CORS_ORIGINS', '*').split(','),
    credentials: true,
  })

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SafarGo API')
    .setDescription('API de covoiturage SafarGo avec module tourisme Algérie')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification')
    .addTag('users', 'Utilisateurs')
    .addTag('trips', 'Trajets')
    .addTag('bookings', 'Réservations')
    .addTag('payments', 'Paiements')
    .addTag('messages', 'Messages')
    .addTag('places', 'Lieux touristiques')
    .addTag('admin', 'Administration')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  const port = config.get('PORT', 3000)
  await app.listen(port)
  
  console.log(`🚀 SafarGo API running on http://localhost:${port}`)
  console.log(`📚 API documentation available at http://localhost:${port}/docs`)
}

bootstrap()