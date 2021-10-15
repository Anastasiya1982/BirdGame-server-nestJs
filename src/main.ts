import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

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
  app.use(cookieParser());
  app.useStaticAssets(path.join(__dirname, 'uploads'));
  await app.listen(PORT, () => {
    console.log(` Server is listerning on ${PORT}`);
  });
}
start();
