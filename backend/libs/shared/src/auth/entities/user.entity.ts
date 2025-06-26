import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "./organization.entity";

export enum UserRole {
  ROOT = "root",
  ADMIN = "admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isRoot(): boolean {
    return this.role === UserRole.ROOT;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.ROOT;
  }

  isManager(): boolean {
    return this.role === UserRole.MANAGER || this.isAdmin();
  }

  canManageUser(targetUser: User): boolean {
    if (this.isRoot()) return true;
    if (this.role === UserRole.ADMIN && this.organizationId === targetUser.organizationId)
      return true;
    if (
      this.role === UserRole.MANAGER &&
      this.organizationId === targetUser.organizationId &&
      targetUser.role === UserRole.EMPLOYEE
    )
      return true;
    return false;
  }
}
