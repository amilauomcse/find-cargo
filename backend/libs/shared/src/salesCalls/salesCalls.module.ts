import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesCallsEntity } from './entities/salesCalls.entity';
import { SalesCallsController } from 'apps/api/src/salesCalls/salesCalls.controller';
import { SalesCallsService } from 'apps/api/src/salesCalls/salesCalls.service';

@Module({
	imports: [TypeOrmModule.forFeature([SalesCallsEntity])],
	controllers: [SalesCallsController],
	providers: [SalesCallsService],
	exports: [SalesCallsService],
})
export class SalesCallsModule {}
