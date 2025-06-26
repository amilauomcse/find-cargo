import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RateEntity } from "./entities/rate.entity";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [TypeOrmModule.forFeature([RateEntity]), AuditModule],
  providers: [],
  exports: [AuditModule],
})
export class RatesModule {}
