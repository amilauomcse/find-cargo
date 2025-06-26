import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Organization } from "../../auth/entities/organization.entity";

export enum AuditAction {
  // User Management
  USER_CREATED = "user_created",
  USER_UPDATED = "user_updated",
  USER_DELETED = "user_deleted",
  USER_STATUS_CHANGED = "user_status_changed",
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_PASSWORD_CHANGED = "user_password_changed",
  USER_PROFILE_UPDATED = "user_profile_updated",

  // Organization Management
  ORGANIZATION_CREATED = "organization_created",
  ORGANIZATION_UPDATED = "organization_updated",
  ORGANIZATION_DELETED = "organization_deleted",
  ORGANIZATION_STATUS_CHANGED = "organization_status_changed",

  // Inquiry Management
  INQUIRY_CREATED = "inquiry_created",
  INQUIRY_UPDATED = "inquiry_updated",
  INQUIRY_DELETED = "inquiry_deleted",
  INQUIRY_STATUS_CHANGED = "inquiry_status_changed",

  // Sales Call Management
  SALES_CALL_CREATED = "sales_call_created",
  SALES_CALL_UPDATED = "sales_call_updated",
  SALES_CALL_DELETED = "sales_call_deleted",

  // Rate Management
  RATE_CREATED = "rate_created",
  RATE_UPDATED = "rate_updated",
  RATE_DELETED = "rate_deleted",

  // System Actions
  SYSTEM_CONFIGURATION_CHANGED = "system_configuration_changed",
  BACKUP_CREATED = "backup_created",
  DATA_EXPORTED = "data_exported",
  DATA_IMPORTED = "data_imported",
}

export enum AuditResourceType {
  USER = "user",
  ORGANIZATION = "organization",
  INQUIRY = "inquiry",
  SALES_CALL = "sales_call",
  RATE = "rate",
  SYSTEM = "system",
}

@Entity({ name: "audit_logs" })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: "enum",
    enum: AuditResourceType,
  })
  resourceType: AuditResourceType;

  @Column({ nullable: true })
  resourceId: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "jsonb", nullable: true })
  details: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  // Helper methods
  static createLog(
    action: AuditAction,
    resourceType: AuditResourceType,
    description: string,
    userId?: number,
    organizationId?: number,
    resourceId?: number,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): Partial<AuditLog> {
    return {
      action,
      resourceType,
      resourceId,
      description,
      details,
      userId,
      organizationId,
      ipAddress,
      userAgent,
    };
  }
}
