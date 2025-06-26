import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Injectable()
export class RateService {
  private readonly logger = new Logger(RateService.name);

  constructor(
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,
    private auditService: AuditService,
  ) {}

  async createRate(
    rateData: Partial<RateEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<RateEntity> {
    try {
      this.logger.log(
        `Creating new rate with data: ${JSON.stringify(rateData)}`,
      );
      const newRate = this.rateRepository.create(rateData);
      const rate = await this.rateRepository.save(newRate);
      this.logger.log(`Successfully created rate with ID: ${rate.id}`);

      // Log the audit event if user and organization are provided
      if (userId && organizationId) {
        await this.auditService.logRateAction(
          AuditAction.RATE_CREATED,
          `Rate created: ${rate.loadingPort} to ${rate.dischargePort}`,
          userId,
          organizationId,
          rate.id,
          {
            rateId: rate.id,
            loadingPort: rate.loadingPort,
            dischargePort: rate.dischargePort,
          },
          request,
        );
      }

      return rate;
    } catch (error) {
      this.logger.error(`Failed to create rate: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAllRates(): Promise<RateEntity[]> {
    try {
      this.logger.log('Fetching all rates');
      const rates = await this.rateRepository.find();
      this.logger.log(`Successfully fetched ${rates.length} rates`);
      return rates;
    } catch (error) {
      this.logger.error(`Failed to fetch rates: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<RateEntity> {
    try {
      this.logger.log(`Fetching rate with ID: ${id}`);
      const rate = await this.rateRepository.findOneBy({ id });
      if (!rate) {
        this.logger.warn(`Rate not found with ID: ${id}`);
        throw new Error(`Rate not found with ID: ${id}`);
      }
      this.logger.log(`Successfully fetched rate with ID: ${id}`);
      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to fetch rate with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateRate(
    id: number,
    rateData: Partial<RateEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<RateEntity> {
    try {
      this.logger.log(`Updating rate with ID: ${id}`);
      await this.rateRepository.update(id, rateData);
      const rate = await this.rateRepository.findOneBy({ id });
      this.logger.log(`Successfully updated rate with ID: ${id}`);

      // Log the audit event if user and organization are provided
      if (userId && organizationId) {
        await this.auditService.logRateAction(
          AuditAction.RATE_UPDATED,
          `Rate updated: ${rate.loadingPort} to ${rate.dischargePort}`,
          userId,
          organizationId,
          rate.id,
          {
            rateId: rate.id,
            loadingPort: rate.loadingPort,
            dischargePort: rate.dischargePort,
            changes: rateData,
          },
          request,
        );
      }

      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to update rate with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteRate(
    id: number,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<RateEntity> {
    try {
      this.logger.log(`Deleting rate with ID: ${id}`);
      const rate = await this.rateRepository.findOneBy({ id });
      if (!rate) {
        this.logger.warn(`Rate not found with ID: ${id}`);
        throw new Error(`Rate not found with ID: ${id}`);
      }
      await this.rateRepository.delete(id);
      this.logger.log(`Successfully deleted rate with ID: ${id}`);

      // Log the audit event if user and organization are provided
      if (userId && organizationId) {
        await this.auditService.logRateAction(
          AuditAction.RATE_DELETED,
          `Rate deleted: ${rate.loadingPort} to ${rate.dischargePort}`,
          userId,
          organizationId,
          rate.id,
          {
            rateId: rate.id,
            loadingPort: rate.loadingPort,
            dischargePort: rate.dischargePort,
          },
          request,
        );
      }

      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to delete rate with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getStats() {
    try {
      this.logger.log('Fetching rate statistics');
      const total = await this.rateRepository.count();

      // Get recent rates (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recent = await this.rateRepository.count({
        where: {
          createdAt: MoreThanOrEqual(sevenDaysAgo),
        },
      });

      this.logger.log(`Rate stats - Total: ${total}, Recent: ${recent}`);
      return {
        total,
        recent,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch rate stats: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
