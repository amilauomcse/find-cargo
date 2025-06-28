import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { RateEntity } from '../../../../libs/shared/src/rates/entities/rate.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, UserFromJwt } from '../auth/decorators/user.decorator';
import { Request } from 'express';

@Controller('rates')
@UseGuards(JwtAuthGuard)
export class RateController {
  private readonly logger = new Logger(RateController.name);
  constructor(private readonly rateService: RateService) {}

  @Post('add')
  async createRate(
    @Body() rateData: Partial<RateEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<RateEntity> {
    this.logger.log(`Creating new rate with data: ${JSON.stringify(rateData)}`);
    return this.rateService.createRate(
      rateData,
      user.sub,
      user.organizationId,
      request,
    );
  }

  @Get()
  async getAllRates(): Promise<RateEntity[]> {
    return this.rateService.getAllRates();
  }

  @Get('stats')
  async getStats() {
    return this.rateService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rateService.findOne(id);
  }

  @Put(':id')
  async updateRate(
    @Param('id') id: number,
    @Body() updateData: Partial<RateEntity>,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<RateEntity> {
    return this.rateService.updateRate(
      id,
      updateData,
      user.sub,
      user.organizationId,
      request,
    );
  }

  @Delete(':id')
  async deleteRate(
    @Param('id') id: number,
    @CurrentUser() user: UserFromJwt,
    @Req() request: Request,
  ): Promise<RateEntity> {
    return this.rateService.deleteRate(
      id,
      user.sub,
      user.organizationId,
      request,
    );
  }
}
