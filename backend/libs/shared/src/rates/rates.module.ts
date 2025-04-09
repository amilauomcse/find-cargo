import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateEntity } from './entities/rate.entity';
import { RateController } from 'apps/api/src/rate/rate.controller';
import { RateService } from 'apps/api/src/rate/rate.service';

@Module({
	imports: [TypeOrmModule.forFeature([RateEntity])],
	controllers: [RateController],
	providers: [RateService],
	exports: [RateService],
})
export class RatesModule {}
