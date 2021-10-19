import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGOOSE, { useCreateIndex: true }),
        UserModule,
        AuthModule,
        MailModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
