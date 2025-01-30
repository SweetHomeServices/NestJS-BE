import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessageResponseDto } from './dto/chat-message-response.dto';

@ApiTags('Chat Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

 
  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get all chat messages for a lead' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of chat messages for the specified lead',
    type: [ChatMessageResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findByLeadId(@Param('leadId') leadId: string) {
    return this.chatMessagesService.findByLeadId(leadId);
  }
}