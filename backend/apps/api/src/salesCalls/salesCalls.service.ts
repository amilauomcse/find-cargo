import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesCallsEntity } from '../../../../libs/shared/src/salesCalls/entities/salesCalls.entity';

@Injectable()
export class SalesCallsService {
  constructor(
    @InjectRepository(SalesCallsEntity)
    private salesCallsRepository: Repository<SalesCallsEntity>,
  ) {}

  async createSalesCall(
    salesCallsData: Partial<SalesCallsEntity>,
  ): Promise<SalesCallsEntity> {
    const newSalesCall = this.salesCallsRepository.create(salesCallsData);
    return await this.salesCallsRepository.save(newSalesCall);
  }

  async getAllSalesCalls(): Promise<SalesCallsEntity[]> {
    return await this.salesCallsRepository.find();
  }

  async findOne(id: number) {
    return this.salesCallsRepository.findOneBy({ id });
  }
}
