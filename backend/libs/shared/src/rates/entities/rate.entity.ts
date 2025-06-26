import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "rate_entity" })
export class RateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentName: string;

  @Column({ type: "date" })
  etd: string;

  @Column()
  carrier: string;

  @Column()
  containerType: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  seaFreight: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  otherCost: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  exCost: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column()
  transitTime: string;

  @Column()
  rateType: string;

  @Column({ type: "date", nullable: true })
  createdDate: string;

  @Column()
  type: string;

  @Column()
  loadingPort: string;

  @Column()
  dischargePort: string;

  // Add organization support
  @Column({ nullable: true })
  organizationId: number;

  @Column({ nullable: true })
  createdById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
