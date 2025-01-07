import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateKnowledgeBaseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  primaryGoal?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  spamFilter?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  importantRules?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  useEmojiOnResponse?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communicationTone?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  campaignId?: string;
}