import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

// System database configuration
export const systemOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("database.host"),
  port: configService.get<number>("database.port"),
  username: configService.get<string>("database.username"),
  password: configService.get<string>("database.password"),
  database: configService.get<string>("database.database"),
  synchronize: true, // Enable for development
  autoLoadEntities: true,
  dropSchema: false,
  logging: configService.get<boolean>("database.logging"),
  ssl: false, // Disable SSL for local development
  poolSize: 50,
  extra: {
    max: 10,
    idleTimeoutMillis: 60000,
  },
});

// Auth database configuration
export const authOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("authDatabase.host"),
  port: configService.get<number>("authDatabase.port"),
  username: configService.get<string>("authDatabase.username"),
  password: configService.get<string>("authDatabase.password"),
  database: configService.get<string>("authDatabase.database"),
  synchronize: true, // Enable for development
  autoLoadEntities: true,
  dropSchema: false,
  logging: configService.get<boolean>("authDatabase.logging"),
  ssl: false, // Disable SSL for local development
  poolSize: 50,
  extra: {
    max: 10,
    idleTimeoutMillis: 60000,
  },
});

// Default export for backward compatibility
const ormConfig = (configService: ConfigService): TypeOrmModuleOptions =>
  systemOrmConfig(configService);

export default ormConfig;

// DataSource configuration for TypeORM CLI
export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.AUTH_DATABASE_HOST || "localhost",
  port: parseInt(process.env.AUTH_DATABASE_PORT || "5432"),
  username: process.env.AUTH_DATABASE_USERNAME || "postgres",
  password: process.env.AUTH_DATABASE_PASSWORD || "password",
  database: process.env.AUTH_DATABASE_DATABASE || "auth_db",
  entities: [__dirname + "/../../shared/src/**/*.entity.ts"],
  migrations: [__dirname + "/../../../migrations/*.ts"], // Use TypeScript files
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
});
