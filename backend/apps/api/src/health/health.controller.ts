import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    return this.healthService.checkHealth();
  }

  @Get('detailed')
  @HttpCode(HttpStatus.OK)
  async getDetailedHealth() {
    return this.healthService.getDetailedHealth();
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async getReadiness() {
    const health = await this.healthService.checkHealth();
    return {
      status: health.status === 'healthy' ? 'ready' : 'not ready',
      timestamp: health.timestamp,
    };
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  async getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
