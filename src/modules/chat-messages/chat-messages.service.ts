import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../../entities/chat-message.entity';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
  ) {}

 
  async findByLeadId(leadId: string): Promise<ChatMessage[]> {
    const messages = await this.chatMessagesRepository.find({
      where: { lead: { id: leadId } },
      order: { createdAt: 'ASC' }
    });

    if (!messages.length) {
      throw new NotFoundException(`No chat messages found for lead with ID ${leadId}`);
    }

    return messages;
  }
}