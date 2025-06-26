import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesCallsService } from './salesCalls.service';
import { SalesCallsEntity } from '../../../../libs/shared/src/salesCalls/entities/salesCalls.entity';

@Controller('salesCalls')
export class SalesCallsController {
  constructor(private readonly salesCallsService: SalesCallsService) {}

  @Post('add')
  async createSalesCall(
    @Body() salesCallsData: Partial<SalesCallsEntity>,
  ): Promise<SalesCallsEntity> {
    return this.salesCallsService.createSalesCall(salesCallsData);
  }

  @Get()
  async getAllSalesCalls(): Promise<SalesCallsEntity[]> {
    return this.salesCallsService.getAllSalesCalls();
  }

  @Get('stats')
  async getStats() {
    return this.salesCallsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.salesCallsService.findOne(id);
  }
}
