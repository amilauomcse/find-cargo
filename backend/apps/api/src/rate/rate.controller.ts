import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';

@Controller('rates')
export class RateController {
  private readonly logger = new Logger(RateController.name);
  constructor(private readonly rateService: RateService) {}

  @Post('add')
  async createRate(@Body() rateData: Partial<RateEntity>): Promise<RateEntity> {
    this.logger.log(`Creating new rate with data: ${JSON.stringify(rateData)}`);
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
