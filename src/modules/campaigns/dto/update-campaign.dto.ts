import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from './working-hours.dto';


export class UpdateCampaignDto {
  @ApiProperty({ example: 'Summer Campaign 2023', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Inbound', description: 'Campaign type', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'Active', description: 'Campaign status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Pacific Time', description: 'Campaign timezone', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: '+15554446666', description: 'Campaign phone number', required: false })
  @IsString()
  @IsOptional()
  campaignPhone?: string;

  @ApiProperty({ example: '+15554446667', description: 'Admin phone number', required: false })
  @IsString()
  @IsOptional()
  adminPhone?: string;

  @ApiProperty({
    example: 'Thank you for reaching out! Our office is currently closed.',
    description: 'Message to display after hours',
    required: false
  })
  @IsString()
  @IsOptional()
  afterHoursMessage?: string;

  @ApiProperty({
    type: WorkingHours,
    description: 'Working hours configuration for each day of the week',
    required: false
  })
  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => WorkingHours)
  workingHours?: WorkingHours;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Knowledge Base ID',
    required: false
  })
  @IsUUID()
  @IsOptional()
  knowledgeBaseId?: string;
}