import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../../../libs/shared/src/auth/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ROOT)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async getUser(@Param('id') id: string, @Request() req: any) {
    // Check if user is admin and trying to access user from different organization
    if (req.user.role === UserRole.ADMIN) {
      const user = await this.usersService.findById(parseInt(id));
      if (user.organizationId !== req.user.organizationId) {
        throw new Error('Access denied');
      }
    }
    return this.usersService.findById(parseInt(id));
  }

  @Post()
  @Roles(UserRole.ROOT)
  async createUser(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Request() req: any,
  ) {
    // Check if user is admin and trying to update user from different organization
    if (req.user.role === UserRole.ADMIN) {
      const user = await this.usersService.findById(parseInt(id));
      if (user.organizationId !== req.user.organizationId) {
        throw new Error('Access denied');
      }
    }
    return this.usersService.update(parseInt(id), updateUserDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string },
    @Request() req: any,
  ) {
    // Check if user is admin and trying to update user from different organization
    if (req.user.role === UserRole.ADMIN) {
      const user = await this.usersService.findById(parseInt(id));
      if (user.organizationId !== req.user.organizationId) {
        throw new Error('Access denied');
      }
    }
    return this.usersService.updateStatus(parseInt(id), statusDto.status);
  }

  @Delete(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    // Check if user is admin and trying to delete user from different organization
    if (req.user.role === UserRole.ADMIN) {
      const user = await this.usersService.findById(parseInt(id));
      if (user.organizationId !== req.user.organizationId) {
        throw new Error('Access denied');
      }
    }
    return this.usersService.delete(parseInt(id));
  }
}
