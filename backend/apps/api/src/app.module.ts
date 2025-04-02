import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "@app/core/config/configuration";
import ormConfig from "@app/core/config/orm-config";
import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ormConfig(configService),
    }),
    CoreModule,
    SharedModule,
  ],
})
export class AppModule {}
