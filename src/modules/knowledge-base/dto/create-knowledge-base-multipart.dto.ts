import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { CreateKnowledgeBaseDto } from './create-knowledge-base.dto';

export class CreateKnowledgeBaseMultipartDto extends CreateKnowledgeBaseDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional DOCX file to upload',
  })
  file?: any;
}