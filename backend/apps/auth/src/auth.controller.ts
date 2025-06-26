import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  AuthService,
  LoginDto,
  RegisterOrganizationDto,
  CreateUserDto,
} from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@app/shared/auth/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  async test() {
    return { message: 'Auth controller is working!' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    return this.authService.login(loginDto);
  }

  @Post('register/organization')
  async registerOrganization(@Body() registerDto: RegisterOrganizationDto) {
    return this.authService.registerOrganization(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.authService.createUser(createUserDto, req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return req.user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDto: any) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('init-root')
  async initRootUser() {
    return this.authService.createRootUser();
  }
}
