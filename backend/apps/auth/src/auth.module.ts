import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    const logger = new Logger(AuthModule.name);
    try {
      // Create root user on startup
      const rootUser = await this.authService.createRootUser();
      logger.log('Root user initialized: ' + rootUser.email);
    } catch (error) {
      logger.error('Failed to create root user:', error.message);
    }
  }
}
