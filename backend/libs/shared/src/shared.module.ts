import { Module } from "@nestjs/common";
import { SharedService } from "./shared.service";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { RatesModule } from "./rates/rates.module";
import { SalesCallsModule } from "./salesCalls/salesCalls.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [InquiriesModule, RatesModule, SalesCallsModule, AuditModule],
  providers: [SharedService],
  exports: [SharedService, InquiriesModule, RatesModule, SalesCallsModule, AuditModule],
})
export class SharedModule {}
