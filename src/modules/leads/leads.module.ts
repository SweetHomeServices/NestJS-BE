import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../../entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { InquiryController } from './inquiry.controller';
import { Client } from 'src/entities/client.entity';
import { Campaign } from 'src/entities/campaign.entity';
import { S3Module } from '../S3/s3.module';
import { S3Service } from '../S3/s3.service';

@Module({
  imports: [S3Module, TypeOrmModule.forFeature([Lead]), TypeOrmModule.forFeature([Client]), TypeOrmModule.forFeature([Campaign])],
  controllers: [LeadsController, InquiryController],
  providers: [LeadsService, S3Service],
  exports: [LeadsService],
})
export class LeadsModule {}