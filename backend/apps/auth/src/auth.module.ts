import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../../../libs/shared/src/auth/entities/user.entity';
import { Organization } from '../../../libs/shared/src/auth/entities/organization.entity';
import { RefreshToken } from '../../../libs/shared/src/auth/entities/refresh-token.entity';
import { AuditModule } from '../../api/src/audit/audit.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Organization, RefreshToken], 'auth'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    AuditModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @InjectDataSource('auth') private readonly authDataSource: DataSource,
  ) {}

  async onModuleInit() {
    const logger = new Logger(AuthModule.name);

    try {
      // Note: Migrations should be run manually before starting the application
      // Use: yarn migration:run
      logger.log('Auth module initialized successfully');

      // Create root user on startup
      const rootUser = await this.authService.createRootUser();
      logger.log('Root user initialized: ' + rootUser.email);
    } catch (error) {
      logger.error('Failed to initialize auth module:', error.message);
      // Don't throw error to prevent app from crashing
      logger.warn(
        'Continuing with application startup despite initialization issues',
      );
    }
  }
}
