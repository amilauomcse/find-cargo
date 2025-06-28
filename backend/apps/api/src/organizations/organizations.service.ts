import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import {
  Organization,
  OrganizationStatus,
} from '../../../../libs/shared/src/auth/entities/organization.entity';
import {
  User,
  UserRole,
  UserStatus,
} from '../../../../libs/shared/src/auth/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization, 'auth')
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User, 'auth')
    private userRepository: Repository<User>,
    private auditService: AuditService,
  ) {}

  async findAll() {
    const organizations = await this.organizationRepository.find({
      relations: ['users'],
    });

    // Get user count for each organization
    const organizationsWithUserCount = await Promise.all(
      organizations.map(async (org) => {
        const userCount = await this.userRepository.count({
          where: { organization: { id: org.id } },
        });
        return {
          ...org,
          userCount,
        };
      }),
    );

    return organizationsWithUserCount;
  }

  async findById(id: number) {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async create(createOrganizationDto: any, userId?: number, request?: any) {
    const { adminUser, ...organizationData } = createOrganizationDto;

    // Create organization
    const organization = this.organizationRepository.create({
      ...organizationData,
      status: OrganizationStatus.ACTIVE, // Root-created organizations are active by default
    });
    const savedOrganization =
      await this.organizationRepository.save(organization);

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const user = new User();
    Object.assign(user, {
      ...adminUser,
      password: hashedPassword,
      role: UserRole.ADMIN,
      organization: savedOrganization,
      status: UserStatus.ACTIVE,
    });
    const savedUser = await this.userRepository.save(user);

    // Log the audit event if user is provided
    if (userId) {
      await this.auditService.logOrganizationAction(
        AuditAction.ORGANIZATION_CREATED,
        `Organization created: ${savedOrganization.name}`,
        userId,
        savedOrganization.id,
        savedOrganization.id,
        {
          organizationId: savedOrganization.id,
          organizationName: savedOrganization.name,
          adminUserId: savedUser.id,
          adminEmail: savedUser.email,
        },
        request,
      );
    }

    return {
      ...savedOrganization,
      adminUser: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    };
  }

  async update(
    id: number,
    updateOrganizationDto: any,
    userId?: number,
    request?: any,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    Object.assign(organization, updateOrganizationDto);
    const updatedOrganization =
      await this.organizationRepository.save(organization);

    // Log the audit event if user is provided
    if (userId) {
      await this.auditService.logOrganizationAction(
        AuditAction.ORGANIZATION_UPDATED,
        `Organization updated: ${updatedOrganization.name}`,
        userId,
        updatedOrganization.id,
        updatedOrganization.id,
        {
          organizationId: updatedOrganization.id,
          organizationName: updatedOrganization.name,
          changes: updateOrganizationDto,
        },
        request,
      );
    }

    return updatedOrganization;
  }

  async updateStatus(
    id: number,
    status: string,
    userId?: number,
    request?: any,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const oldStatus = organization.status;
    // Convert string to enum value
    const statusEnum = status as OrganizationStatus;
    organization.status = statusEnum;
    const updatedOrganization =
      await this.organizationRepository.save(organization);

    // Log the audit event if user is provided
    if (userId) {
      await this.auditService.logOrganizationAction(
        AuditAction.ORGANIZATION_STATUS_CHANGED,
        `Organization status changed: ${updatedOrganization.name} to ${status}`,
        userId,
        updatedOrganization.id,
        updatedOrganization.id,
        {
          organizationId: updatedOrganization.id,
          organizationName: updatedOrganization.name,
          oldStatus: oldStatus,
          newStatus: status,
        },
        request,
      );
    }

    return updatedOrganization;
  }

  async delete(id: number, userId?: number, request?: any) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Log the audit event if user is provided
    if (userId) {
      await this.auditService.logOrganizationAction(
        AuditAction.ORGANIZATION_DELETED,
        `Organization deleted: ${organization.name}`,
        userId,
        organization.id,
        organization.id,
        {
          organizationId: organization.id,
          organizationName: organization.name,
          userCount: organization.users.length,
        },
        request,
      );
    }

    // Delete all users in the organization
    await this.userRepository.remove(organization.users);

    // Delete the organization
    return this.organizationRepository.remove(organization);
  }

  async getUsers(organizationId: number) {
    return this.userRepository.find({
      where: { organization: { id: organizationId } },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'status',
        'createdAt',
      ],
    });
  }

  async addUser(
    organizationId: number,
    createUserDto: any,
    userId?: number,
    request?: any,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      organization,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    // Log the audit event if user is provided
    if (userId) {
      await this.auditService.logUserAction(
        AuditAction.USER_CREATED,
        `User created: ${savedUser.email} in organization ${organization.name}`,
        userId,
        organizationId,
        savedUser.id,
        {
          newUserId: savedUser.id,
          newUserEmail: savedUser.email,
          newUserRole: savedUser.role,
          organizationId: organizationId,
          organizationName: organization.name,
        },
        request,
      );
    }

    return savedUser;
  }

  async publicRegister(createOrganizationDto: any) {
    const { adminUser, ...organizationData } = createOrganizationDto;

    // Create organization with status 'pending'
    const organization = this.organizationRepository.create({
      ...organizationData,
      status: OrganizationStatus.INACTIVE, // Use INACTIVE for pending
    });
    const savedOrganization =
      await this.organizationRepository.save(organization);

    // Create admin user (inactive until approval)
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const user = new User();
    Object.assign(user, {
      ...adminUser,
      password: hashedPassword,
      role: UserRole.ADMIN,
      organization: savedOrganization,
      status: UserStatus.INACTIVE,
    });
    const savedUser = await this.userRepository.save(user);

    return {
      ...savedOrganization,
      adminUser: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
      message: 'Organization registered and pending approval.',
    };
  }
}
