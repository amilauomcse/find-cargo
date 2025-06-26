import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { AuditLog, AuditAction, AuditResourceType } from "./entities/audit-log.entity";
import { Request } from "express";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog, "auth")
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async createLog(
    action: AuditAction,
    resourceType: AuditResourceType,
    description: string,
    userId?: number,
    organizationId?: number,
    resourceId?: number,
    details?: any,
    request?: Request
  ): Promise<AuditLog> {
    try {
      const ipAddress = request?.ip || request?.connection?.remoteAddress || "unknown";
      const userAgent = request?.headers["user-agent"] || "unknown";

      const auditLog = this.auditLogRepository.create(
        AuditLog.createLog(
          action,
          resourceType,
          description,
          userId,
          organizationId,
          resourceId,
          details,
          ipAddress,
          userAgent
        )
      );

      const savedLog = await this.auditLogRepository.save(auditLog);
      this.logger.log(`Audit log created: ${action} - ${description}`);

      return savedLog;
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAuditLogs(
    userId: number,
    userRole: string,
    userOrganizationId?: number,
    filters?: {
      action?: AuditAction;
      resourceType?: AuditResourceType;
      startDate?: Date;
      endDate?: Date;
      userId?: number;
      organizationId?: number;
      page?: number;
      limit?: number;
    }
  ) {
    try {
      const queryBuilder = this.auditLogRepository
        .createQueryBuilder("audit")
        .leftJoinAndSelect("audit.user", "user")
        .leftJoinAndSelect("audit.organization", "organization")
        .orderBy("audit.createdAt", "DESC");

      // Apply role-based filtering
      if (userRole === "root") {
        // Root users can see all audit logs
      } else if (userRole === "admin") {
        // Admin users can only see logs from their organization
        queryBuilder.andWhere("audit.organizationId = :organizationId", {
          organizationId: userOrganizationId,
        });
      } else {
        // Other users can only see their own logs
        queryBuilder.andWhere("audit.userId = :userId", { userId });
      }

      // Apply filters
      if (filters?.action) {
        queryBuilder.andWhere("audit.action = :action", { action: filters.action });
      }

      if (filters?.resourceType) {
        queryBuilder.andWhere("audit.resourceType = :resourceType", {
          resourceType: filters.resourceType,
        });
      }

      if (filters?.startDate && filters?.endDate) {
        queryBuilder.andWhere("audit.createdAt BETWEEN :startDate AND :endDate", {
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
      }

      if (filters?.userId) {
        queryBuilder.andWhere("audit.userId = :filterUserId", { filterUserId: filters.userId });
      }

      if (filters?.organizationId) {
        queryBuilder.andWhere("audit.organizationId = :filterOrgId", {
          filterOrgId: filters.organizationId,
        });
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 50;
      const offset = (page - 1) * limit;

      queryBuilder.skip(offset).take(limit);

      const [auditLogs, total] = await queryBuilder.getManyAndCount();

      return {
        auditLogs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to get audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAuditLogById(id: number, userId: number, userRole: string, userOrganizationId?: number) {
    try {
      const queryBuilder = this.auditLogRepository
        .createQueryBuilder("audit")
        .leftJoinAndSelect("audit.user", "user")
        .leftJoinAndSelect("audit.organization", "organization")
        .where("audit.id = :id", { id });

      // Apply role-based filtering
      if (userRole === "root") {
        // Root users can see all audit logs
      } else if (userRole === "admin") {
        // Admin users can only see logs from their organization
        queryBuilder.andWhere("audit.organizationId = :organizationId", {
          organizationId: userOrganizationId,
        });
      } else {
        // Other users can only see their own logs
        queryBuilder.andWhere("audit.userId = :userId", { userId });
      }

      const auditLog = await queryBuilder.getOne();

      if (!auditLog) {
        throw new Error("Audit log not found or access denied");
      }

      return auditLog;
    } catch (error) {
      this.logger.error(`Failed to get audit log by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAuditStats(userId: number, userRole: string, userOrganizationId?: number) {
    try {
      const queryBuilder = this.auditLogRepository.createQueryBuilder("audit");

      // Apply role-based filtering
      if (userRole === "root") {
        // Root users can see all audit logs
      } else if (userRole === "admin") {
        // Admin users can only see logs from their organization
        queryBuilder.andWhere("audit.organizationId = :organizationId", {
          organizationId: userOrganizationId,
        });
      } else {
        // Other users can only see their own logs
        queryBuilder.andWhere("audit.userId = :userId", { userId });
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Get today's count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayCount = await queryBuilder
        .andWhere("audit.createdAt >= :today AND audit.createdAt < :tomorrow", {
          today,
          tomorrow,
        })
        .getCount();

      // Get action breakdown
      const actionBreakdown = await queryBuilder
        .select("audit.action", "action")
        .addSelect("COUNT(*)", "count")
        .groupBy("audit.action")
        .getRawMany();

      // Get resource type breakdown
      const resourceTypeBreakdown = await queryBuilder
        .select("audit.resourceType", "resourceType")
        .addSelect("COUNT(*)", "count")
        .groupBy("audit.resourceType")
        .getRawMany();

      return {
        total,
        todayCount,
        actionBreakdown,
        resourceTypeBreakdown,
      };
    } catch (error) {
      this.logger.error(`Failed to get audit stats: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Convenience methods for common audit actions
  async logUserAction(
    action: AuditAction,
    description: string,
    userId: number,
    organizationId?: number,
    resourceId?: number,
    details?: any,
    request?: Request
  ) {
    return this.createLog(
      action,
      AuditResourceType.USER,
      description,
      userId,
      organizationId,
      resourceId,
      details,
      request
    );
  }

  async logOrganizationAction(
    action: AuditAction,
    description: string,
    userId: number,
    organizationId: number,
    resourceId?: number,
    details?: any,
    request?: Request
  ) {
    return this.createLog(
      action,
      AuditResourceType.ORGANIZATION,
      description,
      userId,
      organizationId,
      resourceId,
      details,
      request
    );
  }

  async logInquiryAction(
    action: AuditAction,
    description: string,
    userId: number,
    organizationId: number,
    resourceId: number,
    details?: any,
    request?: Request
  ) {
    return this.createLog(
      action,
      AuditResourceType.INQUIRY,
      description,
      userId,
      organizationId,
      resourceId,
      details,
      request
    );
  }

  async logSalesCallAction(
    action: AuditAction,
    description: string,
    userId: number,
    organizationId: number,
    resourceId: number,
    details?: any,
    request?: Request
  ) {
    return this.createLog(
      action,
      AuditResourceType.SALES_CALL,
      description,
      userId,
      organizationId,
      resourceId,
      details,
      request
    );
  }

  async logRateAction(
    action: AuditAction,
    description: string,
    userId: number,
    organizationId: number,
    resourceId: number,
    details?: any,
    request?: Request
  ) {
    return this.createLog(
      action,
      AuditResourceType.RATE,
      description,
      userId,
      organizationId,
      resourceId,
      details,
      request
    );
  }
}
