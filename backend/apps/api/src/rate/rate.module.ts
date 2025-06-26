import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([RateEntity]), AuditModule],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
