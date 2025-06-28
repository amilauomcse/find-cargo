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
import { CurrentUser, UserFromJwt } from '../auth/decorators/user.decorator';

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
  async createOrganization(
    @Body() createOrganizationDto: any,
    @CurrentUser() user: UserFromJwt,
    @Request() request: any,
  ) {
    return this.organizationsService.create(
      createOrganizationDto,
      user.sub,
      request,
    );
  }

  @Patch(':id')
  @Roles(UserRole.ROOT)
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: any,
    @CurrentUser() user: UserFromJwt,
    @Request() request: any,
  ) {
    return this.organizationsService.update(
      parseInt(id),
      updateOrganizationDto,
      user.sub,
      request,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.ROOT)
  async updateOrganizationStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: string },
    @CurrentUser() user: UserFromJwt,
    @Request() request: any,
  ) {
    return this.organizationsService.updateStatus(
      parseInt(id),
      statusDto.status,
      user.sub,
      request,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ROOT)
  async deleteOrganization(
    @Param('id') id: string,
    @CurrentUser() user: UserFromJwt,
    @Request() request: any,
  ) {
    return this.organizationsService.delete(parseInt(id), user.sub, request);
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
    @CurrentUser() user: UserFromJwt,
    @Request() request: any,
  ) {
    // Check if user is admin of this organization
    if (user.role === UserRole.ADMIN && user.organizationId !== parseInt(id)) {
      throw new Error('Access denied');
    }
    return this.organizationsService.addUser(
      parseInt(id),
      createUserDto,
      user.sub,
      request,
    );
  }

  @Post('register')
  async publicRegister(@Body() createOrganizationDto: any) {
    // Always set status to 'pending' for public registration
    return this.organizationsService.publicRegister(createOrganizationDto);
  }
}
