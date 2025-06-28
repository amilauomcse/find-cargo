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
import { SalesCallsService } from './salesCalls.service';
import { SalesCallsEntity } from '../../../../libs/shared/src/salesCalls/entities/salesCalls.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserFromJwt } from '../auth/decorators/user.decorator';
import { Request } from 'express';

@Controller('salesCalls')
@UseGuards(JwtAuthGuard)
export class SalesCallsController {
  constructor(private readonly salesCallsService: SalesCallsService) {}

  @Post('add')
  async createSalesCall(
    @Body() salesCallsData: Partial<SalesCallsEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<SalesCallsEntity> {
    return this.salesCallsService.createSalesCall(
      salesCallsData,
      user.sub,
      user.organizationId,
      request,
    );
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

  @Put(':id')
  async updateSalesCall(
    @Param('id') id: number,
    @Body() updateData: Partial<SalesCallsEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<SalesCallsEntity> {
    return this.salesCallsService.updateSalesCall(
      id,
      updateData,
      user.sub,
      user.organizationId,
      request,
    );
  }

  @Delete(':id')
  async deleteSalesCall(
    @Param('id') id: number,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<void> {
    return this.salesCallsService.deleteSalesCall(
      id,
      user.sub,
      user.organizationId,
      request,
    );
  }
}
