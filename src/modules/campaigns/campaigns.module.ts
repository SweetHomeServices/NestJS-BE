import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../../entities/campaign.entity';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { KnowledgeBase } from 'src/entities/knowledgebase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), TypeOrmModule.forFeature([KnowledgeBase])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}