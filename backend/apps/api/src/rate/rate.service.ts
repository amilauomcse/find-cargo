import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(RateEntity)
    private rateRepository: Repository<RateEntity>,
  ) {}

  async createRate(rateData: Partial<RateEntity>): Promise<RateEntity> {
    const newRate = this.rateRepository.create(rateData);
    return await this.rateRepository.save(newRate);
  }

  async getAllRates(): Promise<RateEntity[]> {
    return await this.rateRepository.find();
  }

  async findOne(id: number) {
    return this.rateRepository.findOneBy({ id });
  }
}
