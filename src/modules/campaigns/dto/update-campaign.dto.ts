import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCampaignDto {
  @ApiProperty({ example: 'Summer Sale 2023', description: 'Campaign name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Summer promotion campaign', description: 'Campaign description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2023-06-01', description: 'Campaign start date', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ example: '2023-08-31', description: 'Campaign end date', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ example: 'active', description: 'Campaign status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: { budget: 10000 }, description: 'Campaign settings', required: false })
  @IsOptional()
  settings?: Record<string, any>;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Client ID', required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;
}