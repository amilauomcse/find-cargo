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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrganizationsService } from './organizations.service';
import { UserRole } from '../../../../libs/shared/src/auth/entities/user.entity';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @Roles(UserRole.ROOT)
  async getAllOrganizations() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ROOT)
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.findById(parseInt(id));
  }

  @Post()
  @Roles(UserRole.ROOT)
  async createOrganization(@Body() createOrganizationDto: any) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Patch(':id')
  @Roles(UserRole.ROOT)
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: any,
  ) {
    return this.organizationsService.update(
      parseInt(id),
      updateOrganizationDto,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.ROOT)
  async updateOrganizationStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string },
  ) {
    return this.organizationsService.updateStatus(
      parseInt(id),
      statusDto.status,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ROOT)
  async deleteOrganization(@Param('id') id: string) {
    return this.organizationsService.delete(parseInt(id));
  }

  @Get(':id/users')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async getOrganizationUsers(@Param('id') id: string, @Request() req: any) {
    // Check if user is admin of this organization
    if (
      req.user.role === UserRole.ADMIN &&
      req.user.organizationId !== parseInt(id)
    ) {
      throw new Error('Access denied');
    }
    return this.organizationsService.getUsers(parseInt(id));
  }

  @Post(':id/users')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async addUserToOrganization(
    @Param('id') id: string,
    @Body() createUserDto: any,
    @Request() req: any,
  ) {
    // Check if user is admin of this organization
    if (
      req.user.role === UserRole.ADMIN &&
      req.user.organizationId !== parseInt(id)
    ) {
      throw new Error('Access denied');
    }
    return this.organizationsService.addUser(parseInt(id), createUserDto);
  }

  @Post('register')
  async publicRegister(@Body() createOrganizationDto: any) {
    // Always set status to 'pending' for public registration
    return this.organizationsService.publicRegister(createOrganizationDto);
  }
}
