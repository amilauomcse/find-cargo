import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "sales_calls_entity" })
export class SalesCallsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentName: string;

  @Column()
  companyName: string;

  @Column()
  contactedEmployee: string;

  @Column()
  contactNo: string;

  @Column()
  contactEmail: string;

  @Column()
  feedback: string;

  @Column({ type: "date", nullable: true })
  createdDate: string;

  @Column({ type: "date", nullable: true })
  followUpDate: string;

  @Column({ nullable: true })
  organizationId: number;

  @Column({ nullable: true })
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
