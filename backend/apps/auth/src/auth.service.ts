import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserRole,
  UserStatus,
} from '../../../libs/shared/src/auth/entities/user.entity';
import {
  Organization,
  OrganizationStatus,
} from '../../../libs/shared/src/auth/entities/organization.entity';
import { RefreshToken } from '../../../libs/shared/src/auth/entities/refresh-token.entity';
import { AuditService } from '../../api/src/audit/audit.service';
import {
  AuditAction,
  AuditResourceType,
} from '../../../libs/shared/src/audit/entities/audit-log.entity';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterOrganizationDto {
  organization: {
    name: string;
    slug: string;
    description?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
  };
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  };
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId: number;
  phoneNumber?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'auth')
    private userRepository: Repository<User>,
    @InjectRepository(Organization, 'auth')
    private organizationRepository: Repository<Organization>,
    @InjectRepository(RefreshToken, 'auth')
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (
        user.organization &&
        (user.status !== UserStatus.ACTIVE ||
          user.organization.status !== OrganizationStatus.ACTIVE)
      ) {
        throw new UnauthorizedException(
          'Account or organization is not active.',
        );
      }
      if (!user.organization && user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('Account is not active.');
      }
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = await this.generateTokens(user);
    await this.auditService.createLog(
      AuditAction.USER_LOGIN,
      AuditResourceType.USER,
      `User logged in`,
      user.id,
      user.organizationId,
      user.id,
      { email: user.email },
    );
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization,
        fullName: user.fullName,
      },
      ...tokens,
    };
  }

  async registerOrganization(registerDto: RegisterOrganizationDto) {
    // Check if organization slug already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { slug: registerDto.organization.slug },
    });
    if (existingOrg) {
      throw new ConflictException('Organization slug already exists');
    }

    // Check if admin email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.admin.email },
    });
    if (existingUser) {
      throw new ConflictException('Admin email already exists');
    }

    // Create organization
    const organization = this.organizationRepository.create({
      ...registerDto.organization,
      status: OrganizationStatus.ACTIVE,
      maxUsers: 10, // Default limit
    });
    await this.organizationRepository.save(organization);

    // Create admin user
    const hashedPassword = await bcrypt.hash(registerDto.admin.password, 10);
    const adminUser = this.userRepository.create({
      ...registerDto.admin,
      password: hashedPassword,
      role: UserRole.ADMIN,
      organizationId: organization.id,
      status: UserStatus.ACTIVE,
    });
    await this.userRepository.save(adminUser);

    await this.auditService.createLog(
      AuditAction.ORGANIZATION_CREATED,
      AuditResourceType.ORGANIZATION,
      `Organization created`,
      adminUser.id,
      organization.id,
      organization.id,
      { organizationName: organization.name },
    );

    return {
      organization,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
      },
    };
  }

  async createUser(createUserDto: CreateUserDto, currentUser: User) {
    // Check permissions
    if (!currentUser.isAdmin()) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
    });
    await this.userRepository.save(user);

    await this.auditService.createLog(
      AuditAction.USER_CREATED,
      AuditResourceType.USER,
      `User created`,
      currentUser.id,
      currentUser.organizationId,
      user.id,
      { newUserEmail: user.email, role: user.role },
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async refreshToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(refreshToken.user);
    await this.auditService.createLog(
      AuditAction.USER_LOGIN,
      AuditResourceType.USER,
      `User refreshed tokens`,
      refreshToken.userId,
      refreshToken.user.organizationId,
      refreshToken.userId,
      { email: refreshToken.user.email },
    );
    return tokens;
  }

  async logout(token: string) {
    await this.refreshTokenRepository.update(
      { token },
      { revokedAt: new Date() },
    );
    await this.auditService.createLog(
      AuditAction.USER_LOGOUT,
      AuditResourceType.USER,
      `User logged out`,
      null,
      null,
      null,
      { token },
    );
  }

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    // Save refresh token
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    await this.auditService.createLog(
      AuditAction.USER_LOGIN,
      AuditResourceType.USER,
      `Refresh token created`,
      user.id,
      user.organizationId,
      user.id,
      { email: user.email },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async createRootUser() {
    const existingRoot = await this.userRepository.findOne({
      where: { role: UserRole.ROOT },
    });

    if (existingRoot) {
      return existingRoot;
    }

    const hashedPassword = await bcrypt.hash('123', 10);
    const rootUser = this.userRepository.create({
      email: 'root@email.com',
      password: hashedPassword,
      firstName: 'Root',
      lastName: 'Admin',
      role: UserRole.ROOT,
      status: UserStatus.ACTIVE,
    });

    return await this.userRepository.save(rootUser);
  }

  async updateProfile(userId: number, updateProfileDto: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    Object.assign(user, updateProfileDto);

    // Save updated user
    const updatedUser = await this.userRepository.save(user);

    await this.auditService.createLog(
      AuditAction.USER_PROFILE_UPDATED,
      AuditResourceType.USER,
      `User profile updated`,
      updatedUser.id,
      updatedUser.organizationId,
      updatedUser.id,
      { updatedFields: Object.keys(updateProfileDto) },
    );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      organizationId: updatedUser.organizationId,
    };
  }
}
