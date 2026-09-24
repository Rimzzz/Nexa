import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Nexa POS API')
    .setDescription('API Documentation for Nexa Point of Sale System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'BearerAuth',
    )
    .addSecurityRequirements('BearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Nexa POS API Docs',
  });

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Nexa Backend running on port ${port}`);
  console.log(`📖 Swagger UI available at http://localhost:${port}/api/docs`);
}

bootstrap();
