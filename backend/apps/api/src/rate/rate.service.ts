import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';

@Injectable()
export class RateService {
  private readonly logger = new Logger(RateService.name);

  constructor(
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,
  ) {}

  async createRate(rateData: Partial<RateEntity>): Promise<RateEntity> {
    try {
      this.logger.log(
        `Creating new rate with data: ${JSON.stringify(rateData)}`,
      );
      const newRate = this.rateRepository.create(rateData);
      const rate = await this.rateRepository.save(newRate);
      this.logger.log(`Successfully created rate with ID: ${rate.id}`);
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
  ): Promise<RateEntity> {
    try {
      this.logger.log(`Updating rate with ID: ${id}`);
      await this.rateRepository.update(id, rateData);
      const rate = await this.rateRepository.findOneBy({ id });
      this.logger.log(`Successfully updated rate with ID: ${id}`);
      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to update rate with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteRate(id: number): Promise<RateEntity> {
    try {
      this.logger.log(`Deleting rate with ID: ${id}`);
      const rate = await this.rateRepository.findOneBy({ id });
      if (!rate) {
        this.logger.warn(`Rate not found with ID: ${id}`);
        throw new Error(`Rate not found with ID: ${id}`);
      }
      await this.rateRepository.delete(id);
      this.logger.log(`Successfully deleted rate with ID: ${id}`);
      return rate;
    } catch (error) {
      this.logger.error(
        `Failed to delete rate with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
