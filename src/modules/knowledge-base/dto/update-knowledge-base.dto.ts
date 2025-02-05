import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { AiModel } from './ai-model.enum';

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
  @Transform(({ value }) => value === 'true' ? true : false)
  @IsOptional()
  useEmojiOnResponse?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communicationTone?: string;

  @ApiProperty({
    enum: AiModel,
    example: AiModel.GPT40MINI,
    description: 'AI model for the knowledgebase',
    enumName: 'AiModel'
  })
  @IsEnum(AiModel)
  @IsOptional()
  model: AiModel;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  campaignId?: string;
}