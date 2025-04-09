import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post('add')
  async createRate(@Body() rateData: Partial<RateEntity>): Promise<RateEntity> {
    return this.rateService.createRate(rateData);
  }

  @Get()
  async getAllRates(): Promise<RateEntity[]> {
    return this.rateService.getAllRates();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rateService.findOne(id);
  }
}
