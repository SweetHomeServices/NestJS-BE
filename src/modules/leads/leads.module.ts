import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../../entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { InquiryController } from './inquiry.controller';
import { Client } from 'src/entities/client.entity';
import { Campaign } from 'src/entities/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), TypeOrmModule.forFeature([Client]), TypeOrmModule.forFeature([Campaign])],
  controllers: [LeadsController, InquiryController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}