import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from '../../../entities/campaign.entity';

export class CampaignResponseDto extends Campaign {
  @ApiProperty({ example: 100, description: 'Number of leads for the campaign' })
  numberOfLeads: number;

  @ApiProperty({ example: 75, description: 'Percentage of leads that converted' })
  conversionRate: number;
}