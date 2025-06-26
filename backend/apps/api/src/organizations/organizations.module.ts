import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Organization } from '../../../../libs/shared/src/auth/entities/organization.entity';
import { User } from '../../../../libs/shared/src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User], 'auth')],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
