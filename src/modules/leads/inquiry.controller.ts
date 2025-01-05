import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from '../../entities/lead.entity';
import { IncomingSmsDto } from './dto/incoming-sms.dto';
import { IncomingWhatsappDto } from './dto/incoming-whatsapp.dto';

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

  @Post('process-incoming-text')
  @ApiOperation({ summary: 'Process incoming text message' })
  @ApiResponse({ status: 201, description: 'Text message processed successfully' })
  processIncomingText(@Body() dto: IncomingSmsDto) {
    this.leadsService.processIncomingSms(dto);
    return;
  }

  @Post('test-sms')
  @ApiOperation({ summary: 'Test SMS' })
  @ApiResponse({ status: 201, description: 'Text message sent successfully' })
  testText() {
    const fromNumber = '+18009918414';
    const toNumber = '+18188504565';
    const message = 'Hello from SignalWire!';
    this.leadsService.sendSms(fromNumber, toNumber, message );
    return;
  }

  @Post('process-incoming-whatsapp')
  @ApiOperation({ summary: 'Process incoming whatsapp message' })
  @ApiResponse({ status: 201, description: 'Whatsapp message processed successfully' })
  processIncomingWhatsapp(@Body() dto: IncomingWhatsappDto) {
    console.log('Processing incoming whatsapp message');
    this.leadsService.processIncomingWhatsapp(dto);
    return;
  }
}