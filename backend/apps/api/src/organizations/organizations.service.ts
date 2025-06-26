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

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization, 'auth')
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User, 'auth')
    private userRepository: Repository<User>,
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

  async create(createOrganizationDto: any) {
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

  async update(id: number, updateOrganizationDto: any) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    Object.assign(organization, updateOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async updateStatus(id: number, status: string) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Convert string to enum value
    const statusEnum = status as OrganizationStatus;
    organization.status = statusEnum;
    return this.organizationRepository.save(organization);
  }

  async delete(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!organization) {
      throw new Error('Organization not found');
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

  async addUser(organizationId: number, createUserDto: any) {
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

    return this.userRepository.save(user);
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
