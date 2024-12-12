import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: { source: 'website' }, description: 'Additional information' })
  @IsOptional()
  additionalInfo?: Record<string, any>;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Campaign ID' })
  @IsUUID()
  @IsNotEmpty()
  campaignId: string;
}