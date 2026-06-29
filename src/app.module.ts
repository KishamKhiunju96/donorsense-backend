import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { appConfig }      from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig }      from './config/jwt.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule }     from './modules/auth/auth.module';
import { UsersModule }    from './modules/users/users.module';
import { AppController }  from './app.controller';
import { JwtAuthGuard }   from './common/guards/jwt-auth.guard';
import { RolesGuard }     from './common/guards/roles.guard';
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
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
