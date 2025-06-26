import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesCallsController } from './salesCalls.controller';
import { SalesCallsService } from './salesCalls.service';
import { SalesCallsEntity } from '../../../../libs/shared/src/salesCalls/entities/salesCalls.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesCallsEntity]), AuditModule],
  controllers: [SalesCallsController],
  providers: [SalesCallsService],
  exports: [SalesCallsService],
})
export class SalesCallsModule {}
