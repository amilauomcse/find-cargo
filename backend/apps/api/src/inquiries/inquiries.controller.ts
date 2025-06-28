import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiryEntity } from '../../../../libs/shared/src/inquiries/entities/inquiry.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserFromJwt } from '../auth/decorators/user.decorator';
import { Request } from 'express';

@Controller('inquiries')
@UseGuards(JwtAuthGuard)
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('add')
  async createInquiry(
    @Body() inquiryData: Partial<InquiryEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<InquiryEntity> {
    return this.inquiriesService.createInquiry(
      inquiryData,
      user.sub,
      user.organizationId,
      request,
    );
  }

  @Get()
  async getAllInquiries(): Promise<InquiryEntity[]> {
    return this.inquiriesService.getAllInquiries();
  }

  @Get('stats')
  async getStats() {
    return this.inquiriesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.inquiriesService.findOne(id);
  }

  @Put(':id')
  async updateInquiry(
    @Param('id') id: number,
    @Body() updateData: Partial<InquiryEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<InquiryEntity> {
    return this.inquiriesService.updateInquiry(
      id,
      updateData,
      user.sub,
      user.organizationId,
      request,
    );
  }

  @Delete(':id')
  async deleteInquiry(
    @Param('id') id: number,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<void> {
    return this.inquiriesService.deleteInquiry(
      id,
      user.sub,
      user.organizationId,
      request,
    );
  }
}
