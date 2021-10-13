import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function start() {
  const PORT = process.env.PORT || 5000;
  const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS',"PUT"],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: corsOptions });
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', process.env.UPLOAD_LOCATION), {
    prefix: `/${process.env.UPLOAD_LOCATION}/`,
  });
  await app.listen(PORT, () => {
    console.log(` Server is listerning on ${PORT}`);
  });
}
start();

