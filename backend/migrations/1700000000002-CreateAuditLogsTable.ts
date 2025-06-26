import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAuditLogsTable1700000000002 implements MigrationInterface {
  name = "CreateAuditLogsTable1700000000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
            CREATE TYPE "audit_action_enum" AS ENUM (
                'user_created', 'user_updated', 'user_deleted', 'user_status_changed',
                'user_login', 'user_logout', 'user_password_changed', 'user_profile_updated',
                'organization_created', 'organization_updated', 'organization_deleted', 'organization_status_changed',
                'inquiry_created', 'inquiry_updated', 'inquiry_deleted', 'inquiry_status_changed',
                'sales_call_created', 'sales_call_updated', 'sales_call_deleted',
                'rate_created', 'rate_updated', 'rate_deleted',
                'system_configuration_changed', 'backup_created', 'data_exported', 'data_imported'
            )
        `);

    await queryRunner.query(`
            CREATE TYPE "audit_resource_type_enum" AS ENUM (
                'user', 'organization', 'inquiry', 'sales_call', 'rate', 'system'
            )
        `);

    // Create audit_logs table
    await queryRunner.createTable(
      new Table({
        name: "audit_logs",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "action",
            type: "audit_action_enum",
          },
          {
            name: "resourceType",
            type: "audit_resource_type_enum",
          },
          {
            name: "resourceId",
            type: "int",
            isNullable: true,
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "details",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "ipAddress",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "userAgent",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "userId",
            type: "int",
            isNullable: true,
          },
          {
            name: "organizationId",
            type: "int",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      "audit_logs",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "audit_logs",
      new TableForeignKey({
        columnNames: ["organizationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "organizations",
        onDelete: "SET NULL",
      })
    );

    // Create indexes for better performance
    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_action" ON "audit_logs" ("action")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_resource_type" ON "audit_logs" ("resourceType")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("userId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_organization_id" ON "audit_logs" ("organizationId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("createdAt")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_audit_logs_user_org" ON "audit_logs" ("userId", "organizationId")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_user_org"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_organization_id"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_resource_type"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_action"`);

    // Drop table
    await queryRunner.dropTable("audit_logs");

    // Drop enum types
    await queryRunner.query(`DROP TYPE "audit_resource_type_enum"`);
    await queryRunner.query(`DROP TYPE "audit_action_enum"`);
  }
}
