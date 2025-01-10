import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../../entities/client.entity';
import { KnowledgeBase } from '../../../entities/knowledgebase.entity';
import { Lead } from '../../../entities/lead.entity';

class WorkingHoursDay {
  @ApiProperty({ example: false })
  closed: boolean;

  @ApiProperty({ example: '9:00 AM' })
  opens: string;

  @ApiProperty({ example: '5:00 PM' })
  closes: string;
}

class WorkingHours {
  @ApiProperty({ type: WorkingHoursDay })
  monday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  tuesday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  wednesday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  thursday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  friday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  saturday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  sunday: WorkingHoursDay;
}

export class CampaignResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'david-test' })
  name: string;

  @ApiProperty({ example: 'Inbound' })
  type: string;

  @ApiProperty({ example: 'Active' })
  status: string;

  @ApiProperty({ example: 'Pacific Time' })
  timezone: string;

  @ApiProperty({ example: '+15554446666' })
  campaignPhone: string;

  @ApiProperty({ example: '+15554446667' })
  adminPhone: string;

  @ApiProperty({ 
    example: 'Thank you for reaching out! Our office is currently closed. We will get back to you during business hours.' 
  })
  afterHoursMessage: string;

  @ApiProperty({ type: WorkingHours })
  workingHours: WorkingHours;

  @ApiProperty({ type: () => Client })
  client: Client;

  @ApiProperty({ type: () => KnowledgeBase })
  knowledgeBase: KnowledgeBase;

  @ApiProperty({ type: () => Lead, isArray: true })
  leads: Lead[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}