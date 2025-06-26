import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../../../libs/shared/src/auth/entities/user.entity';
import { AuditService } from './audit.service';
import {
  AuditAction,
  AuditResourceType,
} from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async getAuditLogs(
    @Request() req,
    @Query('action') action?: AuditAction,
    @Query('resourceType') resourceType?: AuditResourceType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('organizationId') organizationId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};

    if (action) filters.action = action;
    if (resourceType) filters.resourceType = resourceType;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (userId) filters.userId = parseInt(userId);
    if (organizationId) filters.organizationId = parseInt(organizationId);
    if (page) filters.page = parseInt(page);
    if (limit) filters.limit = parseInt(limit);

    return this.auditService.getAuditLogs(
      req.user.id,
      req.user.role,
      req.user.organizationId,
      filters,
    );
  }

  @Get('stats')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async getAuditStats(@Request() req) {
    return this.auditService.getAuditStats(
      req.user.id,
      req.user.role,
      req.user.organizationId,
    );
  }

  @Get(':id')
  @Roles(UserRole.ROOT, UserRole.ADMIN)
  async getAuditLogById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.auditService.getAuditLogById(
      id,
      req.user.id,
      req.user.role,
      req.user.organizationId,
    );
  }
}
