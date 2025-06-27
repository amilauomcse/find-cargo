import { DataSource } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

async function runMigrations() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.AUTH_DATABASE_HOST || "localhost",
    port: parseInt(process.env.AUTH_DATABASE_PORT || "5432"),
    username: process.env.AUTH_DATABASE_USERNAME || "postgres",
    password: process.env.AUTH_DATABASE_PASSWORD || "password",
    database: process.env.AUTH_DATABASE_DATABASE || "auth_db",
    migrations: [__dirname + "/../migrations/*.ts"],
    synchronize: false,
    logging: true,
  });

  try {
    console.log("Initializing migration DataSource...");
    await dataSource.initialize();

    console.log("Checking for pending migrations...");
    const pendingMigrations = await dataSource.showMigrations();

    if (pendingMigrations) {
      console.log("Running migrations...");
      await dataSource.runMigrations();
      console.log("Migrations completed successfully!");
    } else {
      console.log("No pending migrations found.");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runMigrations();
