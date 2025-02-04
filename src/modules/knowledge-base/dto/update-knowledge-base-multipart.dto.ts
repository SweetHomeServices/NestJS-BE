import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { CreateKnowledgeBaseDto } from './create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './update-knowledge-base.dto';

export class UpdateKnowledgeBaseMultipartDto extends UpdateKnowledgeBaseDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional DOCX file to upload',
  })
  file?: any;
}