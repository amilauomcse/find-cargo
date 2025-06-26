import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class CreateRootUser1700000000000 implements MigrationInterface {
  name = "CreateRootUser1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only run this migration on the auth database
    const currentDatabase = await queryRunner.query(`SELECT current_database()`);
    const dbName = currentDatabase[0].current_database;

    if (dbName !== "auth_db") {
      console.log(`⏭️  Skipping root user creation on database: ${dbName}`);
      return;
    }

    // Check if root user already exists
    const existingRoot = await queryRunner.query(
      `SELECT id FROM "user" WHERE email = 'root' AND role = 'ROOT'`
    );

    if (existingRoot.length === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash("123", 10);

      // Create root user
      await queryRunner.query(`
        INSERT INTO "user" (
          "email", 
          "password", 
          "firstName", 
          "lastName", 
          "role", 
          "status", 
          "createdAt", 
          "updatedAt"
        ) VALUES (
          'root',
          '${hashedPassword}',
          'Root',
          'Admin',
          'ROOT',
          'ACTIVE',
          NOW(),
          NOW()
        )
      `);

      console.log("✅ Root user created successfully");
      console.log("📧 Email: root");
      console.log("🔑 Password: 123");
    } else {
      console.log("ℹ️  Root user already exists, skipping creation");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only run this migration on the auth database
    const currentDatabase = await queryRunner.query(`SELECT current_database()`);
    const dbName = currentDatabase[0].current_database;

    if (dbName !== "auth_db") {
      return;
    }

    // Remove root user
    await queryRunner.query(`
      DELETE FROM "user" WHERE email = 'root' AND role = 'ROOT'
    `);

    console.log("🗑️  Root user removed");
  }
}
