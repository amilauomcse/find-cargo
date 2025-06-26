import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalesCallsEntity } from "./entities/salesCalls.entity";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [TypeOrmModule.forFeature([SalesCallsEntity]), AuditModule],
  providers: [],
  exports: [AuditModule],
})
export class SalesCallsModule {}
