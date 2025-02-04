import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from '../../entities/lead.entity';
import { LeadReplyDto } from './dto/lead-reply.dto';


@ApiTags('Inquiries')
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry processed successfully' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Post('process-reply')
  @ApiOperation({ summary: 'Process reply' })
  @ApiResponse({ status: 201, description: 'Reply processed successfully' })
  processReply(@Body() dto: LeadReplyDto) {
    console.log('Processing reply');
    this.leadsService.processReply(dto);
    return;
  }
}