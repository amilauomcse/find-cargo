import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { RatesModule } from './rates/rates.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [RatesModule],
})
export class SharedModule {}
