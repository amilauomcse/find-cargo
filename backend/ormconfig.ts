import { DataSource } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

export default new DataSource({
  type: "postgres",
  host: process.env.AUTH_DATABASE_HOST || "localhost",
  port: parseInt(process.env.AUTH_DATABASE_PORT || "5432"),
  username: process.env.AUTH_DATABASE_USERNAME || "postgres",
  password: process.env.AUTH_DATABASE_PASSWORD || "password",
  database: process.env.AUTH_DATABASE_DATABASE || "auth_db",
  entities: ["libs/shared/src/**/*.entity.ts"],
  migrations: ["migrations/*.ts"],
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
});
