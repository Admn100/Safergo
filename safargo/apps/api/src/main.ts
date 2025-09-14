import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (configService.get<boolean>('SWAGGER_ENABLED', true)) {
    const config = new DocumentBuilder()
      .setTitle('SafarGo API')
      .setDescription('API de la plateforme de covoiturage SafarGo avec module tourisme Algérie')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'Authentification et autorisation')
      .addTag('Users', 'Gestion des utilisateurs')
      .addTag('Drivers', 'Gestion des conducteurs et KYC')
      .addTag('Trips', 'Trajets et covoiturage')
      .addTag('Bookings', 'Réservations')
      .addTag('Payments', 'Paiements et escrow')
      .addTag('Places', 'Lieux touristiques')
      .addTag('Itineraries', 'Itinéraires touristiques')
      .addTag('Messages', 'Messagerie in-app')
      .addTag('Reviews', 'Avis et notations')
      .addTag('Notifications', 'Notifications multi-canal')
      .addTag('Admin', 'Administration et modération')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'SafarGo API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #006233; }
      `,
    });
  }

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get('NODE_ENV'),
      version: '1.0.0',
    });
  });

  const port = configService.get<number>('API_PORT', 3001);
  const host = configService.get<string>('API_HOST', '0.0.0.0');

  await app.listen(port, host);

  logger.log(`🚀 SafarGo API running on http://${host}:${port}`);
  logger.log(`📚 API Documentation available at http://${host}:${port}/docs`);
  logger.log(`❤️ Health check at http://${host}:${port}/health`);
  logger.log(`🌍 Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start SafarGo API:', error);
  process.exit(1);
});