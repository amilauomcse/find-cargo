import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "inquiry_entity" })
export class InquiryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // agentName: string;

  @Column()
  type: string;

  @Column()
  method: string;

  @Column()
  portOfLoading: string;

  @Column()
  portOfDischarge: string;

  @Column({ type: "date", nullable: true })
  createdDate: Date;

  @Column()
  offeredRate: number;

  @Column()
  clientName: string;

  @Column()
  clientContactNo: string;

  @Column()
  clientContactEmail: string;

  @Column()
  feedback: string;

  @Column()
  status: string;

  @Column()
  addedBy: string;

  // @Column({ type: 'date' })
  // etd: string;

  // @Column({ type: 'date', nullable: true })
  // followUpDate: string;

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
