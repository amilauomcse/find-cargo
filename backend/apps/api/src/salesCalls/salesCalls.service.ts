import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SalesCallsEntity } from '../../../../libs/shared/src/salesCalls/entities/salesCalls.entity';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Injectable()
export class SalesCallsService {
  constructor(
    @InjectRepository(SalesCallsEntity)
    private salesCallsRepository: Repository<SalesCallsEntity>,
    private auditService: AuditService,
  ) {}

  async createSalesCall(
    salesCallsData: Partial<SalesCallsEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<SalesCallsEntity> {
    const newSalesCall = this.salesCallsRepository.create(salesCallsData);
    const savedSalesCall = await this.salesCallsRepository.save(newSalesCall);

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService.logSalesCallAction(
        AuditAction.SALES_CALL_CREATED,
        `Sales call created: ${savedSalesCall.companyName || savedSalesCall.id}`,
        userId,
        organizationId,
        savedSalesCall.id,
        {
          salesCallId: savedSalesCall.id,
          companyName: savedSalesCall.companyName,
        },
        request,
      );
    }

    return savedSalesCall;
  }

  async getAllSalesCalls(): Promise<SalesCallsEntity[]> {
    return await this.salesCallsRepository.find();
  }

  async findOne(id: number) {
    return this.salesCallsRepository.findOneBy({ id });
  }

  async getStats() {
    const total = await this.salesCallsRepository.count();

    // Get recent sales calls (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recent = await this.salesCallsRepository.count({
      where: {
        createdAt: MoreThanOrEqual(sevenDaysAgo),
      },
    });

    return {
      total,
      recent,
    };
  }
}
