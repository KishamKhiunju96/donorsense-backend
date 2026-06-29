import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController }        from './app.controller';
import { AppService }           from './app.service';
import { PrismaModule }         from './prisma/prisma.module';
import { AuthModule }           from './auth/auth.module';
import { OrganizationsModule }  from './organizations/organizations.module';
import { DonorsModule }         from './donors/donors.module';
import { DonationsModule }      from './donations/donations.module';
import { CampaignsModule }      from './campaigns/campaigns.module';
import { ReceiptsModule }       from './receipts/receipts.module';
import { OcrModule }            from './ocr/ocr.module';
import { DashboardModule }      from './dashboard/dashboard.module';
import { ExportModule }         from './export/export.module';
import { EmailModule }          from './email/email.module';
import { StripeModule }         from './stripe/stripe.module';

@Module({
  imports: [
    // Config — isGlobal makes ConfigService available everywhere
    ConfigModule.forRoot({ isGlobal: true }),
    // Prisma — global DB client
    PrismaModule,
    // Feature modules
    AuthModule,
    OrganizationsModule,
    DonorsModule,
    DonationsModule,
    CampaignsModule,
    ReceiptsModule,
    OcrModule,
    DashboardModule,
    ExportModule,
    EmailModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
