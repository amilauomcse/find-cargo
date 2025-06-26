import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../../../../libs/shared/src/auth/entities/user.entity';
import { Organization } from '../../../../libs/shared/src/auth/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization], 'auth')],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
