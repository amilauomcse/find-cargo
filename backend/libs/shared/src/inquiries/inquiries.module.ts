import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryEntity } from './entities/inquiry.entity';
import { InquiriesController } from 'apps/api/src/inquiries/inquiries.controller';
import { InquiriesService } from 'apps/api/src/inquiries/inquiries.service';

@Module({
	imports: [TypeOrmModule.forFeature([InquiryEntity])],
	controllers: [InquiriesController],
	providers: [InquiriesService],
	exports: [InquiriesService],
})
export class InquiriesModule {}
