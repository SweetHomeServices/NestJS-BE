import { ApiProperty } from '@nestjs/swagger';
import { Campaign } from '../../../entities/campaign.entity';

export class KnowledgeBaseResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Sales Knowledge Base' })
  name: string;

  @ApiProperty({ example: 'Convert leads into sales' })
  primaryGoal: string;

  @ApiProperty({ example: 'Knowledge base for sales team' })
  description: string;

  @ApiProperty({ example: 'No promotional content' })
  spamFilter: string;

  @ApiProperty({ example: 'Always be professional' })
  importantRules: string;

  @ApiProperty({ example: true })
  useEmojiOnResponse: boolean;

  @ApiProperty({ example: 'Professional' })
  communicationTone: string;

  @ApiProperty({ type: () => Campaign, isArray: true })
  campaigns: Campaign[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}