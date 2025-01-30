import { ApiProperty } from '@nestjs/swagger';
import { Lead } from '../../../entities/lead.entity';

export class ChatMessageResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: 'Hello, I need help with my order' })
  text: string;

  @ApiProperty({ type: () => Lead })
  lead: Lead;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}