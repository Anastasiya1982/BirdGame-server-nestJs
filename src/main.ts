import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 5000;
  const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsOptions,
  });
  const config = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The user authorisation  API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(cookieParser());

  app.useStaticAssets(path.join(__dirname, 'uploads'));
  await app.listen(PORT, () => {
    console.log(` Server is listerning on ${PORT}`);
  });
}
start();
