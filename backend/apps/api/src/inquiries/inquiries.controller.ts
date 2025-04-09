import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiryEntity } from '../../../../libs/shared/src/inquiries/entities/inquiry.entity';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('add')
  async createInquiry(
    @Body() inquiryData: Partial<InquiryEntity>,
  ): Promise<InquiryEntity> {
    return this.inquiriesService.createInquiry(inquiryData);
  }

  @Get()
  async getAllInquiries(): Promise<InquiryEntity[]> {
    return this.inquiriesService.getAllInquiries();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.inquiriesService.findOne(id);
  }
}
