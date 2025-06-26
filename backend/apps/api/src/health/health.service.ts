import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  services: {
    backend: ServiceHealth;
    systemDatabase: ServiceHealth;
    authDatabase: ServiceHealth;
    frontend: ServiceHealth;
  };
  uptime: number;
  version: string;
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  details?: any;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectDataSource('default') private systemDataSource: DataSource,
    @InjectDataSource('auth') private authDataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        backend: { status: 'healthy' },
        systemDatabase: { status: 'healthy' },
        authDatabase: { status: 'healthy' },
        frontend: { status: 'healthy' },
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };

    try {
      // Check system database
      const systemDbStart = Date.now();
      try {
        await this.systemDataSource.query('SELECT 1');
        healthStatus.services.systemDatabase.responseTime =
          Date.now() - systemDbStart;
      } catch (error) {
        healthStatus.services.systemDatabase.status = 'unhealthy';
        healthStatus.services.systemDatabase.error = error.message;
        this.logger.error('System database health check failed:', error);
      }

      // Check auth database
      const authDbStart = Date.now();
      try {
        await this.authDataSource.query('SELECT 1');
        healthStatus.services.authDatabase.responseTime =
          Date.now() - authDbStart;
      } catch (error) {
        healthStatus.services.authDatabase.status = 'unhealthy';
        healthStatus.services.authDatabase.error = error.message;
        this.logger.error('Auth database health check failed:', error);
      }

      // Check frontend
      const frontendStart = Date.now();
      try {
        const frontendUrl = this.configService.get<string>('frontendUrl');
        const response = await axios.get(frontendUrl, {
          timeout: 5000,
        });
        healthStatus.services.frontend.responseTime =
          Date.now() - frontendStart;
        healthStatus.services.frontend.details = {
          statusCode: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        healthStatus.services.frontend.status = 'unhealthy';
        healthStatus.services.frontend.error = error.message;
        this.logger.error('Frontend health check failed:', error);
      }

      // Determine overall status
      const unhealthyServices = Object.values(healthStatus.services).filter(
        (service) => service.status === 'unhealthy',
      );
      const degradedServices = Object.values(healthStatus.services).filter(
        (service) => service.status === 'degraded',
      );

      if (unhealthyServices.length > 0) {
        healthStatus.status = 'unhealthy';
      } else if (degradedServices.length > 0) {
        healthStatus.status = 'degraded';
      }

      healthStatus.services.backend.responseTime = Date.now() - startTime;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      healthStatus.status = 'unhealthy';
      healthStatus.services.backend.status = 'unhealthy';
      healthStatus.services.backend.error = error.message;
    }

    return healthStatus;
  }

  async getDetailedHealth(): Promise<any> {
    const basicHealth = await this.checkHealth();

    // Add more detailed information
    const detailedHealth = {
      ...basicHealth,
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid,
      },
      environment: {
        nodeEnv: this.configService.get<string>('NODE_ENV'),
        appEnv: this.configService.get<string>('APP_ENV'),
      },
      databases: {
        system: {
          isConnected: this.systemDataSource.isInitialized,
          driver: this.systemDataSource.driver.options.type,
        },
        auth: {
          isConnected: this.authDataSource.isInitialized,
          driver: this.authDataSource.driver.options.type,
        },
      },
    };

    return detailedHealth;
  }
}
