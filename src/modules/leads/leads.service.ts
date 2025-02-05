import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import openai from 'src/config/openai.config';
import { Client } from 'src/entities/client.entity';
import signalwire from 'src/config/signalwire.config';
import { Campaign } from 'src/entities/campaign.entity';
import { ChatMessage } from 'src/entities/chat-message.entity';
import { LeadResponseDto } from './dto/lead-response.dto';
import { ChatCompletionMessageParam } from 'openai/resources';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import twilioClient from 'src/config/twilio.config';
import { S3Service } from '../S3/s3.service';
import { parse, format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { LeadSource } from './dto/lead-source.enum';
import { LeadReplyDto } from './dto/lead-reply.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<LeadResponseDto> {
    const lead = this.leadsRepository.create(createLeadDto);
    lead.messages = [];
    const existingClient = await this.clientRepository.findOne({ where: {email: createLeadDto.email} });
    
    if (!existingClient) {
      const client = this.clientRepository.create({
        email: createLeadDto.email,
        firstName: createLeadDto.firstName,
        lastName: createLeadDto.lastName,
        phone: createLeadDto.phone,
      });
      lead.client = await this.clientRepository.save(client);
    }

    const campaignId = createLeadDto.campaignId;

    const campaign = await this.campaignRepository.findOne({ where: { id: campaignId }, relations: ['knowledgeBase'] });

    if (!campaign) {
      console.log(`Campaign with ID ${campaignId} not found`);
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    lead.campaign = campaign;

    if (!this.isWithinWorkingHours(campaign)) {
      return await this.processNotWithinWorkingHours(lead, campaign);
    }


    const messages = [];
    const systemMessage = await this.buildSystemMessage(lead);
   

    const clientMessage = {"role": "user", "content": createLeadDto.text};

    messages.push(systemMessage);
    messages.push(clientMessage);

    const responseMessage = await this.getReplyFromModel(lead, messages);


    if (responseMessage.tool_calls) {
      await this.handleFunctionResponse(responseMessage, lead, true);
    }
    else {
      await this.handleNonFunctionResponse(responseMessage, lead, true);
    }

    const savedLead = await this.leadsRepository.save(lead);

    const leadDto: LeadResponseDto = {
      id: savedLead.id,
      firstName: savedLead.firstName,
      lastName: savedLead.lastName,
      email: savedLead.email,
      phone: savedLead.phone,
      zipcode: savedLead.zipcode,
      additionalInfo: savedLead.additionalInfo,
      source: savedLead.source,
      text: savedLead.text,
      status: savedLead.status,
    };
    return leadDto;
  }

  async findAll(): Promise<Lead[]> {
    return await this.leadsRepository.find({
      relations: ['client', 'campaign'],
    });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['messages'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: Partial<CreateLeadDto>): Promise<Lead> {
    const lead = await this.findOne(id);
    Object.assign(lead, updateLeadDto);
    return await this.leadsRepository.save(lead);
  }

  async remove(id: string): Promise<void> {
    const result = await this.leadsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }


  async processReply(dto: LeadReplyDto) {
    const {From: fromNumber, To: toNumber, Body: body } = dto;
    
    const existingLead = await this.leadsRepository.findOne({
      where: {
        phone: fromNumber,
        campaign: {
          campaignPhone: toNumber,
        },
      },
      relations: ['client', 'campaign','campaign.knowledgeBase', 'messages'],
    });
    if (!existingLead) {
      console.log(`No lead found for phone number ${fromNumber}`);
      return;
    } 
    
    const systemMessage = await this.buildSystemMessage(existingLead);
   

    existingLead.messages.push(  
      Object.assign(new ChatMessage(), {
        lead: existingLead,
        role: 'user',
        text: body
      })
    );

    const mappedExsitingMessages = existingLead.messages.map((message) => ({ role: message.role, content: message.text }));

    const messages: any = [systemMessage, ...mappedExsitingMessages];

    const responseMessage = await this.getReplyFromModel(existingLead, messages);

    if (responseMessage.function_call) {
      console.log('tool calls');
      await this.handleFunctionResponse(responseMessage, existingLead);
    }
    else {
      console.log('no tool calls');
      console.log(responseMessage);
      await this.handleNonFunctionResponse(responseMessage, existingLead);
    }

    await this.leadsRepository.save(existingLead);

    return;
  }

  async sendSms(fromNumber: string, toNumber: string, body: string) {
    try {
      const client = await signalwire;
      let messageClient = client.messaging;
      const sendResult = await messageClient.send({
        from: fromNumber,
        to: toNumber,
        body: body,
      });
    
      console.log(sendResult);
      return sendResult;
    } catch (err) {
      throw new Error(`SignalWire SMS Error: ${err}`);
    }
  }

  async sendWhatsappMessage(toNumber, messageBody) {
    try {
      const message = await twilioClient.messages.create({
        body: messageBody,
        from: 'whatsapp:+14155238886', // This is the Twilio Sandbox WhatsApp number
        to: toNumber,
      });
  
      console.log('Message sent: ', message.sid);
    } catch (error) {
      console.error('Error sending WhatsApp message: ', error);
    }
  }

  async sendMessageToClient(toNumber, messageBody) {
    await this.sendWhatsappMessage(toNumber, messageBody);
  }
  

  async buildSystemMessage(lead: Lead) {

    var extractedText = "";
    if (lead.campaign.knowledgeBase?.s3Key) {
      extractedText = await this.s3Service.extractDocxTextFromS3(lead.campaign.knowledgeBase.s3Key);
    }
    return {
      "role": "system",
      "content" : `${lead.campaign.knowledgeBase?.primaryGoal}. ${extractedText} | For reference, today's date is ${new Date().toLocaleDateString()}.
      The client's name is ${lead.firstName} ${lead.lastName}. The client's email is ${lead.email}. The client's phone number is ${lead.phone}.
      The client's zipcode is ${lead.zipcode}.`,
    };
  }


  isWithinWorkingHours(campaign: Campaign): boolean {

    const TIMEZONE_MAP: Record<string, string> = {
      "pacific time": 'America/Los_Angeles',
      "mountain time": 'America/Denver',
      "central time": 'America/Chicago',
      "eastern time": 'America/New_York',
    };
    // 1) Convert custom timezone code to IANA
    const ianaZone = TIMEZONE_MAP[campaign.timezone?.toLowerCase()] ?? 'America/Los_Angeles';
  
    // 2) "Now" in UTC, plus "zonedNow" as the local time in the campaign's zone
    const nowUtc = new Date();
    const zonedNow = toZonedTime(nowUtc, ianaZone);
  
    // 3) Determine the day-of-week, e.g. "monday", "tuesday"
    const dayOfWeek = format(zonedNow, 'EEEE').toLowerCase(); // e.g. "monday"
  
    // 4) Get today's working hours config
    const dayHours = campaign.workingHours[dayOfWeek];
    if (!dayHours || dayHours.closed) {
      return false; // treat as closed if the day is missing or explicitly closed
    }
  
    // e.g. "9:00 AM", "5:00 PM"
    const openStr = dayHours.opens;
    const closeStr = dayHours.closes;
  
    // We'll parse these times as if they're happening "today" in the campaign's local zone
    const dateString = format(zonedNow, 'yyyy-MM-dd'); // e.g. "2025-02-05"
  
    // 5) Parse "yyyy-MM-dd 9:00 AM" => yields a "naive" Date in system local time
    const openNaive = parse(`${dateString} ${openStr}`, 'yyyy-MM-dd h:mm a', new Date());
    // interpret that naive date as local in ianaZone => convert to real UTC
    const openUtc = fromZonedTime(openNaive, ianaZone);
  
    // 6) Same for close time
    const closeNaive = parse(`${dateString} ${closeStr}`, 'yyyy-MM-dd h:mm a', new Date());
    const closeUtc = fromZonedTime(closeNaive, ianaZone);
  
    // 7) Compare: is the current UTC time between openUtc and closeUtc?
    return nowUtc >= openUtc && nowUtc <= closeUtc;
  }

  async processNotWithinWorkingHours(lead: Lead, campaign: Campaign) {
    if (lead.source != LeadSource.TEST) {
      await this.sendMessageToClient(lead.phone, campaign.afterHoursMessage);
    }

    const clientChatMessage = new ChatMessage();
    clientChatMessage.role = 'user';
    clientChatMessage.text = lead.text;
    clientChatMessage.lead = lead;
    lead.messages.push(clientChatMessage);

    const assistantChatMessage = new ChatMessage();
    assistantChatMessage.role = 'assistant';
    assistantChatMessage.text = campaign.afterHoursMessage;
    assistantChatMessage.lead = lead;
    lead.messages.push(assistantChatMessage);
    
    const savedLead = await this.leadsRepository.save(lead);

    const leadDto: LeadResponseDto = {
      id: savedLead.id,
      firstName: savedLead.firstName,
      lastName: savedLead.lastName,
      email: savedLead.email,
      phone: savedLead.phone,
      zipcode: savedLead.zipcode,
      additionalInfo: savedLead.additionalInfo,
      source: savedLead.source,
      text: savedLead.text,
      status: savedLead.status,
    };
    return leadDto;
  }

  buildCompletionFuntions() {
    return [
      {
        name: "bookService",
        description: "Schedules the requested job. E.g. chimney sweeping.",
        parameters: {
          type: "object",
          properties: {
            serviceType: { type: "string", description: "Type of service (chimney sweeping, etc.)" },
            date: { type: "string", description: "Desired date in YYYY-MM-DD format" },
            time: { type: "string", description: "Desired time in HH:MM format" },
            address: { type: "string", description: "Address where the service will be performed" },
            notes: { type: "string", description: "Any additional user preferences or notes" }
          },
          required: ["serviceType", "date", "time", "address"]
        }
      }
    ];
  }

  async handleNonFunctionResponse(responseMessage, lead, includeClientMessage = false) {
    
    if (includeClientMessage) {
      const clientChatMessage = new ChatMessage();
      clientChatMessage.role = 'user';
      clientChatMessage.text = lead.text;
      clientChatMessage.lead = lead;
      lead.messages.push(clientChatMessage);
    }
    
    const assistantChatMessage = new ChatMessage();
    assistantChatMessage.role = responseMessage.role;
    assistantChatMessage.text = responseMessage.content;
    assistantChatMessage.lead = lead;
    lead.messages.push(assistantChatMessage);

    if (lead.source != LeadSource.TEST) {
      await this.sendMessageToClient(lead.phone, responseMessage.content);
    }
    
  }

  async handleFunctionResponse(responseMessage, lead, includeClientMessage = false) {
    
    if (includeClientMessage) {
      const clientChatMessage = new ChatMessage();
      clientChatMessage.role = 'user';
      clientChatMessage.text = lead.text;
      clientChatMessage.lead = lead;
      lead.messages.push(clientChatMessage);
    }

    const { name, arguments: argsString } = responseMessage.function_call;
    const args = JSON.parse(argsString);


      if (name === "bookService") {
        // 1. Call your scheduling system
        console.log(`Scheduling ${args.serviceType} job for ${args.date} at ${args.time} at ${args.address}.`);
    
        // 2. Respond to user
        const confirmation = `Your ${args.serviceType} job has been scheduled for ${args.date} at ${args.time}.`;
        // (a) Add to conversation
        lead.messages.push(
          Object.assign(new ChatMessage(), {
            lead: lead,
            role: 'assistant',
            text: confirmation
          })
        );
      
        if (lead.source != LeadSource.TEST) {
          await this.sendMessageToClient(lead.phone, confirmation);
        }
      
      } 
  }

  async findCampaignTestLeads (campaignId: string) {  
    const leads = await this.leadsRepository.find({
      where: { source: LeadSource.TEST, campaign: { id: campaignId } },
    });

    return leads;
  }

  async getReplyFromModel(lead: Lead, messages: any) {
    const functions = this.buildCompletionFuntions();
    const model = lead.campaign.knowledgeBase?.model ?? "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      functions,
      function_call: "auto"
    });

    return completion.choices[0].message;
  }
}