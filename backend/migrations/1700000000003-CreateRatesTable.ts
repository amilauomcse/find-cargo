import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRatesTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "rate_entity",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "agentName",
            type: "varchar",
            length: "255",
          },
          {
            name: "etd",
            type: "date",
          },
          {
            name: "carrier",
            type: "varchar",
            length: "255",
          },
          {
            name: "containerType",
            type: "varchar",
            length: "50",
          },
          {
            name: "seaFreight",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "otherCost",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "exCost",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "total",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "transitTime",
            type: "varchar",
            length: "100",
          },
          {
            name: "rateType",
            type: "varchar",
            length: "50",
          },
          {
            name: "createdDate",
            type: "date",
            isNullable: true,
          },
          {
            name: "type",
            type: "varchar",
            length: "50",
          },
          {
            name: "loadingPort",
            type: "varchar",
            length: "255",
          },
          {
            name: "dischargePort",
            type: "varchar",
            length: "255",
          },
          {
            name: "organizationId",
            type: "int",
            isNullable: true,
          },
          {
            name: "createdById",
            type: "int",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("rate_entity");
  }
}
