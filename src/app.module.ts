import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';


@Module({
  imports:[
    ConfigModule.forRoot({ isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGOOSE, { useCreateIndex: true }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers:[]
})
export class AppModule {}

// export class AppModule implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes('api');
//   }
// }
