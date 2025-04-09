import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RatesModule } from './rates/rates.module';
import { SalesCallsModule } from './salesCalls/salesCalls.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
	providers: [SharedService],
	exports: [SharedService],
	imports: [RatesModule, SalesCallsModule, InquiriesModule],
})
export class SharedModule {}
