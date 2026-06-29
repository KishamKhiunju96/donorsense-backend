import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig }      from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig }      from './config/jwt.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule }     from './modules/auth/auth.module';
import { UsersModule }    from './modules/users/users.module';
import { AppController }  from './app.controller';
// Import additional feature modules below this line

@Module({
  imports: [
    // Config — always first; isGlobal makes ConfigService available everywhere
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    // Database
    DatabaseModule,
    // Feature modules
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
