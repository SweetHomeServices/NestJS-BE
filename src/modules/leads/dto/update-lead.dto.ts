import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LeadSource } from './lead-source.enum';

export class UpdateLeadDto {
  @ApiProperty({ example: 'John', description: 'Lead first name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Lead last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Lead email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890', description: 'Lead phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: { source: 'website' }, description: 'Additional information', required: false })
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @ApiProperty({
    enum: LeadSource,
    example: LeadSource.WEBSITE,
    description: 'Source of the lead',
    required: false,
    enumName: 'LeadSource'
  })
  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Client ID', required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Campaign ID', required: false })
  @IsUUID()
  @IsOptional()
  campaignId?: string;

  @ApiProperty({ example: 'qualified', description: 'Lead status', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}