import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemTables1700000000001 implements MigrationInterface {
  name = "CreateSystemTables1700000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only run this migration on the system database
    const currentDatabase = await queryRunner.query(`SELECT current_database()`);
    const dbName = currentDatabase[0].current_database;

    if (dbName !== "cargo_db") {
      console.log(`⏭️  Skipping system tables creation on database: ${dbName}`);
      return;
    }

    // Create inquiries table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inquiry" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "status" VARCHAR(50) DEFAULT 'PENDING',
        "organizationId" INTEGER,
        "createdById" INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create rates table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rate" (
        "id" SERIAL PRIMARY KEY,
        "origin" VARCHAR(255) NOT NULL,
        "destination" VARCHAR(255) NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "currency" VARCHAR(3) DEFAULT 'USD',
        "organizationId" INTEGER,
        "createdById" INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create sales calls table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "salesCalls" (
        "id" SERIAL PRIMARY KEY,
        "customerName" VARCHAR(255) NOT NULL,
        "phoneNumber" VARCHAR(20),
        "notes" TEXT,
        "status" VARCHAR(50) DEFAULT 'PENDING',
        "organizationId" INTEGER,
        "createdById" INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("✅ System tables created successfully");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only run this migration on the system database
    const currentDatabase = await queryRunner.query(`SELECT current_database()`);
    const dbName = currentDatabase[0].current_database;

    if (dbName !== "cargo_db") {
      return;
    }

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "salesCalls"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rate"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inquiry"`);

    console.log("🗑️  System tables removed");
  }
}
