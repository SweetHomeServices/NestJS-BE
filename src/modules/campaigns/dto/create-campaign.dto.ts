import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Sale 2023', description: 'Campaign name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Summer promotion campaign', description: 'Campaign description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2023-06-01', description: 'Campaign start date' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-08-31', description: 'Campaign end date' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: 'active', description: 'Campaign status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: { budget: 10000 }, description: 'Campaign settings' })
  @IsOptional()
  settings?: Record<string, any>;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Client ID' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;
}