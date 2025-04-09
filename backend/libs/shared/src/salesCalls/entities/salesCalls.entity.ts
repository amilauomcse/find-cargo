import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'sales_calls_entity' })
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

	@Column({ type: 'date', nullable: true })
	createdDate: string;

	@Column({ type: 'date', nullable: true })
	followUpDate: string;
}
