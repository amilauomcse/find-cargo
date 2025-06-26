import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { InquiryEntity } from '../../../../libs/shared/src/inquiries/entities/inquiry.entity';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../../../../libs/shared/src/audit/entities/audit-log.entity';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(InquiryEntity)
    private inquiriesRepository: Repository<InquiryEntity>,
    @Optional() private auditService?: AuditService,
  ) {}

  async createInquiry(
    inquiryData: Partial<InquiryEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<InquiryEntity> {
    // Handle createdDate - if it's empty or invalid, set to current date
    if (!inquiryData.createdDate) {
      inquiryData.createdDate = new Date();
    }

    // Set default values for required fields
    if (!inquiryData.status) {
      inquiryData.status = 'Open';
    }

    const newInquiry = this.inquiriesRepository.create(inquiryData);
    const savedInquiry = await this.inquiriesRepository.save(newInquiry);

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService?.logInquiryAction(
        AuditAction.INQUIRY_CREATED,
        `Inquiry created: ${savedInquiry.clientName || savedInquiry.id}`,
        userId,
        organizationId,
        savedInquiry.id,
        { inquiryId: savedInquiry.id, clientName: savedInquiry.clientName },
        request,
      );
    }

    return savedInquiry;
  }

  async getAllInquiries(): Promise<InquiryEntity[]> {
    return await this.inquiriesRepository.find();
  }

  async getStats() {
    const total = await this.inquiriesRepository.count();

    // Get recent inquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recent = await this.inquiriesRepository.count({
      where: {
        createdAt: MoreThanOrEqual(sevenDaysAgo),
      },
    });

    return {
      total,
      recent,
    };
  }

  async findOne(id: number) {
    return this.inquiriesRepository.findOneBy({ id });
  }

  async updateInquiry(
    id: number,
    updateData: Partial<InquiryEntity>,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<InquiryEntity> {
    const inquiry = await this.findOne(id);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }

    const updatedInquiry = await this.inquiriesRepository.save({
      ...inquiry,
      ...updateData,
      updatedAt: new Date(),
    });

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService?.logInquiryAction(
        AuditAction.INQUIRY_UPDATED,
        `Inquiry updated: ${updatedInquiry.clientName || updatedInquiry.id}`,
        userId,
        organizationId,
        updatedInquiry.id,
        {
          inquiryId: updatedInquiry.id,
          clientName: updatedInquiry.clientName,
          changes: updateData,
        },
        request,
      );
    }

    return updatedInquiry;
  }

  async deleteInquiry(
    id: number,
    userId?: number,
    organizationId?: number,
    request?: any,
  ): Promise<void> {
    const inquiry = await this.findOne(id);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }

    await this.inquiriesRepository.remove(inquiry);

    // Log the audit event if user and organization are provided
    if (userId && organizationId) {
      await this.auditService?.logInquiryAction(
        AuditAction.INQUIRY_DELETED,
        `Inquiry deleted: ${inquiry.clientName || inquiry.id}`,
        userId,
        organizationId,
        inquiry.id,
        { inquiryId: inquiry.id, clientName: inquiry.clientName },
        request,
      );
    }
  }
}
