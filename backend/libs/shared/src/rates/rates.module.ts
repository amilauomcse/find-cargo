import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RateEntity } from "./entities/rate.entity";

@Module({ imports: [TypeOrmModule.forFeature([RateEntity])] })
export class RatesModule {}
