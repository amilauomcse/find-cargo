import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import {
  User,
  UserStatus,
} from '../../../../libs/shared/src/auth/entities/user.entity';
import { Organization } from '../../../../libs/shared/src/auth/entities/organization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'auth')
    private userRepository: Repository<User>,
    @InjectRepository(Organization, 'auth')
    private organizationRepository: Repository<Organization>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      relations: ['organization'],
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

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['organization'],
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'status',
        'createdAt',
        'organizationId',
      ],
    });
  }

  async create(createUserDto: any) {
    const { organizationId, ...userData } = createUserDto;

    // Find organization
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      organization,
      status: 'active',
    });

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: any) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateStatus(id: number, status: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Convert string to enum value
    const statusEnum = status as UserStatus;
    user.status = statusEnum;
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.remove(user);
  }
}
