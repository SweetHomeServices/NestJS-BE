import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsObject, IsBoolean, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from './working-hours.dto';



export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Campaign 2023' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Inbound', description: 'Campaign type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Active', description: 'Campaign status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'Pacific Time', description: 'Campaign timezone' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ example: '+15554446666', description: 'Campaign phone number' })
  @IsString()
  @IsNotEmpty()
  campaignPhone: string;

  @ApiProperty({ example: '+15554446667', description: 'Admin phone number' })
  @IsString()
  @IsNotEmpty()
  adminPhone: string;

  @ApiProperty({
    example: 'Thank you for reaching out! Our office is currently closed.',
    description: 'Message to display after hours'
  })
  @IsString()
  @IsNotEmpty()
  afterHoursMessage: string;

  @ApiProperty({
    type: WorkingHours,
    description: 'Working hours configuration for each day of the week'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WorkingHours)
  workingHours: WorkingHours;


  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Knowledge Base ID'
  })
  @IsUUID()
  @IsOptional()
  knowledgeBaseId: string;
}