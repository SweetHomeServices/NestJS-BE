import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AiModel } from './ai-model.enum';

export class CreateKnowledgeBaseDto {
  @ApiProperty({ example: 'Sales Knowledge Base' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Convert leads into sales' })
  @IsString()
  primaryGoal: string;

  @ApiProperty({ example: 'Knowledge base for sales team' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'No promotional content' })
  @IsString()
  spamFilter: string;

  @ApiProperty({ example: 'Always be professional' })
  @IsString()
  importantRules: string;

  @ApiProperty({ example: true })
  @Transform(({ value }) => value === 'true' ? true : false)
  @IsBoolean()
  useEmojiOnResponse: boolean;

  @ApiProperty({ example: 'Professional' })
  @IsString()
  communicationTone: string;

  @ApiProperty({
    enum: AiModel,
    example: AiModel.GPT40MINI,
    description: 'AI model for the knowledgebase',
    enumName: 'AiModel'
  })
  @IsEnum(AiModel)
  @IsOptional()
  model: AiModel;

  @ApiProperty({ required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  campaignId?: string;
}