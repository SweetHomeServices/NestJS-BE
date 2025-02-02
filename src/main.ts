import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transform, Type } from 'class-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <-- important to enable class-transformer
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sweet Home Services API')
    .setDescription('API documentation for Sweet Home Services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  app.enableCors();
  app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
  });
}
bootstrap();