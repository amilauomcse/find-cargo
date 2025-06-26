import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../../../libs/shared/src/auth/entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
