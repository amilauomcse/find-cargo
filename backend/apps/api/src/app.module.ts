import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../../libs/core/src/config/configuration';
import {
  systemOrmConfig,
  authOrmConfig,
} from '../../../libs/core/src/config/orm-config';
import { CoreModule } from '../../../libs/core/src/core.module';
import { SharedModule } from '../../../libs/shared/src/shared.module';
import { AuthModule } from '../../auth/src/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { RateModule } from './rate/rate.module';
import { SalesCallsModule } from './salesCalls/salesCalls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    // System database connection
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        systemOrmConfig(configService),
    }),
    // Auth database connection
    TypeOrmModule.forRootAsync({
      name: 'auth',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        authOrmConfig(configService),
    }),
    CoreModule,
    SharedModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    AuditModule,
    InquiriesModule,
    RateModule,
    SalesCallsModule,
  ],
})
export class AppModule {}
