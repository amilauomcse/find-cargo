import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

const ormConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("database.host"),
  port: parseInt(configService.get<string>("database.port")),
  username: configService.get<string>("database.username"),
  password: configService.get<string>("database.password"),
  database: configService.get<string>("database.database"),
  synchronize: true,
  autoLoadEntities: true,
  dropSchema: false,
  logging: false,
  ssl:
    process.env.APP_ENV && process.env.APP_ENV != "dev"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  poolSize: 50,
  extra: {
    max: 10,
    idleTimeoutMillis: 60000,
  },
});

export default ormConfig;
