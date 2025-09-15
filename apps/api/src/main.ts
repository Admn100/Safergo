import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SafarGo API')
    .setDescription('API pour SafarGo - Covoiturage & Tourisme Algérie 🇩🇿')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentification OTP')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Places', 'Lieux touristiques')
    .addTag('Trips', 'Trajets de covoiturage')
    .addTag('Bookings', 'Réservations')
    .addTag('Payments', 'Paiements escrow')
    .addTag('Itineraries', 'Itinéraires touristiques')
    .addTag('Admin', 'Administration')
    .addTag('Notifications', 'Notifications')
    .addTag('Health', 'Santé de l\'API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SafarGo API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #006233 }
    `,
  });

  // Graceful shutdown
  const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 SafarGo API running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🇩🇿 Made in Algeria with ❤️`);
}

bootstrap();