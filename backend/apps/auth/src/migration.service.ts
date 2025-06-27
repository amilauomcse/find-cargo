import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly configService: ConfigService) {}

  async runMigrations(): Promise<void> {
    try {
      this.logger.log('Running migrations using TypeORM CLI...');

      // Use the existing migration script that works with TypeORM's system
      const scriptPath = path.resolve(
        __dirname,
        '../../../scripts/run-migrations.ts',
      );
      const backendRoot = path.resolve(__dirname, '../../../');

      return new Promise((resolve, reject) => {
        // Set environment variables for the migration script
        const env = {
          ...process.env,
          AUTH_DATABASE_HOST:
            this.configService.get<string>('authDatabase.host'),
          AUTH_DATABASE_PORT:
            this.configService.get<string>('authDatabase.port'),
          AUTH_DATABASE_USERNAME: this.configService.get<string>(
            'authDatabase.username',
          ),
          AUTH_DATABASE_PASSWORD: this.configService.get<string>(
            'authDatabase.password',
          ),
          AUTH_DATABASE_DATABASE: this.configService.get<string>(
            'authDatabase.database',
          ),
        };

        // Use ts-node to run the migration script
        const command = `npx ts-node ${scriptPath}`;

        exec(
          command,
          {
            cwd: backendRoot,
            env,
            maxBuffer: 1024 * 1024, // 1MB buffer
          },
          (error, stdout, stderr) => {
            if (stdout) {
              this.logger.log(stdout.trim());
            }

            if (stderr) {
              this.logger.error(stderr.trim());
            }

            if (error) {
              this.logger.error(`Migration failed: ${error.message}`);
              reject(error);
            } else {
              this.logger.log('Migrations completed successfully');
              resolve();
            }
          },
        );
      });
    } catch (error) {
      this.logger.error('Migration service failed:', error.message);
      // Don't throw error to prevent app from crashing
      this.logger.warn('Continuing without migrations');
    }
  }
}
