import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquiryEntity } from '../../../../libs/shared/src/inquiries/entities/inquiry.entity';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(InquiryEntity)
    private inquiriesRepository: Repository<InquiryEntity>,
  ) {}

  async createInquiry(
    inquiryData: Partial<InquiryEntity>,
  ): Promise<InquiryEntity> {
    const newInquiry = this.inquiriesRepository.create(inquiryData);
    return await this.inquiriesRepository.save(newInquiry);
  }

  async getAllInquiries(): Promise<InquiryEntity[]> {
    return await this.inquiriesRepository.find();
  }

  async findOne(id: number) {
    return this.inquiriesRepository.findOneBy({ id });
  }
}
