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

  async updateSalesCall(
    id: number,
    updateData: Partial<SalesCallsEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<SalesCallsEntity> {
    const salesCall = await this.findOne(id);
    if (!salesCall) {
      throw new Error('Sales call not found');
    }

    const updatedSalesCall = await this.salesCallsRepository.save({
      ...salesCall,
      ...updateData,
      updatedAt: new Date(),
    });

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService.logSalesCallAction(
        AuditAction.SALES_CALL_UPDATED,
        `Sales call updated: ${updatedSalesCall.companyName || updatedSalesCall.id}`,
        userId,
        organizationId,
        updatedSalesCall.id,
        {
          salesCallId: updatedSalesCall.id,
          companyName: updatedSalesCall.companyName,
          changes: updateData,
        },
        request,
      );
    }

    return updatedSalesCall;
  }

  async deleteSalesCall(
    id: number,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<void> {
    const salesCall = await this.findOne(id);
    if (!salesCall) {
      throw new Error('Sales call not found');
    }

    await this.salesCallsRepository.remove(salesCall);

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService.logSalesCallAction(
        AuditAction.SALES_CALL_DELETED,
        `Sales call deleted: ${salesCall.companyName || salesCall.id}`,
        userId,
        organizationId,
        salesCall.id,
        { salesCallId: salesCall.id, companyName: salesCall.companyName },
        request,
      );
    }
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
