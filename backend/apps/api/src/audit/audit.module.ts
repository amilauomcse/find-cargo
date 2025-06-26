import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLog } from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog], 'auth')],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
