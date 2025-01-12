import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { LeadSource } from './lead-source.enum';

export class CreateLeadDto {
  @ApiProperty({ example: 'John', description: 'Lead first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Lead last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Lead email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Lead phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Hi - I want help', description: 'Lead message text' })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: { source: 'website' }, description: 'Additional information' })
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @ApiProperty({
    enum: LeadSource,
    example: LeadSource.WEBSITE,
    description: 'Source of the lead',
    enumName: 'LeadSource'
  })
  @IsEnum(LeadSource)
  @IsNotEmpty()
  source: LeadSource;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Campaign ID' })
  @IsUUID()
  @IsNotEmpty()
  campaignId: string;
}