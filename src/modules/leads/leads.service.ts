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
import { IncomingSmsDto } from './dto/incoming-sms.dto';
import { IncomingWhatsappDto } from './dto/incoming-whatsapp.dto';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import twilioClient from 'src/config/twilio.config';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<LeadResponseDto> {
    const lead = this.leadsRepository.create(createLeadDto);
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
      return null;
    }

    lead.campaign = campaign;

    const functions = [
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

    const messages = [];
    const systemMessage = {
      "role": "system",
      "content" : `${campaign.knowledgeBase.primaryGoal} For reference, today's date is ${new Date().toLocaleDateString()}.`,
    };

    const clientMessage = {"role": "user", "content": createLeadDto.text};

    messages.push(systemMessage);
    messages.push(clientMessage);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      functions,
      function_call: "auto"
    });

    console.log(completion.choices[0].message);

    const responseMessage = completion.choices[0].message;

    const chatMessages: ChatMessage[] = [];

    if (responseMessage.tool_calls) {
      const { name, arguments: argsString } = responseMessage.tool_calls[0].function;
      const args = JSON.parse(argsString);
      
      if (name === "bookService") {
        // 1. Call your scheduling system
        console.log(`Scheduling ${args.serviceType} job for ${args.date} at ${args.time} at ${args.address}.`);
    
        // 2. Respond to user
        const confirmation = `Your ${args.serviceType} job has been scheduled for ${args.date} at ${args.time}.`;
        // (a) Add to conversation
        chatMessages.push(
          Object.assign(new ChatMessage(), {
            lead: lead,
            role: 'assistant',
            text: confirmation
          })
        );
        // (b) Send SMS to user
        console.log(`Sending SMS to ${createLeadDto.phone}: ${confirmation}`);
      }
    }
    else {
      const userChatMessage = new ChatMessage();
      userChatMessage.role = 'user';
      userChatMessage.text = createLeadDto.text;
      userChatMessage.lead = lead;
      chatMessages.push(userChatMessage);
  
      const assistantChatMessage = new ChatMessage();
      assistantChatMessage.role = 'assistant';
      assistantChatMessage.text = responseMessage.content;
      assistantChatMessage.lead = lead;
      chatMessages.push(assistantChatMessage);
  
      lead.messages = chatMessages;
    }

    const savedLead = await this.leadsRepository.save(lead);

    const leadDto: LeadResponseDto = {
      id: savedLead.id,
      firstName: savedLead.firstName,
      lastName: savedLead.lastName,
      email: savedLead.email,
      phone: savedLead.phone,
      additionalInfo: savedLead.additionalInfo,
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
      relations: ['client', 'campaign'],
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

  async processIncomingSms(dto: IncomingSmsDto) {
    const {From: fromNumber, To: toNumber, Body: body } = dto;
    console.log(`Incoming SMS from ${fromNumber} to ${toNumber}: ${body}`);

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
    
    const systemMessage = {
      "role": "system",
       "content" : `${existingLead.campaign?.knowledgeBase?.primaryGoal} For reference, today's date is ${new Date().toLocaleDateString()}.`,
    };
   

    existingLead.messages.push(  
      Object.assign(new ChatMessage(), {
        lead: existingLead,
        role: 'user',
        text: body
      })
    );

   const mappedExsitingMessages = existingLead.messages.map((message) => ({ role: message.role, content: message.text }));

   const messages: any = [systemMessage, ...mappedExsitingMessages];

    const functions = [
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      functions,
      function_call: "auto"
    });

    const responseMessage = completion.choices[0].message;

    if (responseMessage.function_call) {
      console.log('tool calls');
      console.log(responseMessage.function_call);
      const { name, arguments: argsString } = responseMessage.function_call;
      const args = JSON.parse(argsString);
      
      if (name === "bookService") {
        // 1. Call your scheduling system
        console.log(`Scheduling ${args.serviceType} job for ${args.date} at ${args.time} at ${args.address}.`);
    
        // 2. Respond to user
        const confirmation = `Your ${args.serviceType} job has been scheduled for ${args.date} at ${args.time}.`;
        // (a) Add to conversation
        existingLead.messages.push(
          Object.assign(new ChatMessage(), {
            lead: existingLead,
            role: 'assistant',
            text: confirmation
          })
        );
        // (b) Send SMS to user
        console.log(`Sending SMS to ${fromNumber}: ${confirmation}`);
      }
    }
    else {
      console.log('no tool calls');
      console.log(responseMessage);
      const assistantChatMessage = new ChatMessage();
      assistantChatMessage.role = responseMessage.role;
      assistantChatMessage.text = responseMessage.content;
      assistantChatMessage.lead = existingLead;
      existingLead.messages.push(assistantChatMessage);
    }

    const savedLead = await this.leadsRepository.save(existingLead);
    
    return;
  }

  async processIncomingWhatsapp(dto: IncomingWhatsappDto) {
    const {From: fromNumber, Body: body } = dto;
    
    console.log(`Incoming SMS from ${fromNumber}: ${body}`);

    await this.sendWhatsappMessage(fromNumber, 'Howsit!');
  
    
    return;
  }

  async test() {

    const functionDefinitions = [
      {
        name: "bookAppointment",
        description: "Schedules an appointment for the user given a date, time, and any extra details.",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "The date for the appointment, in YYYY-MM-DD format."
            },
            time: {
              type: "string",
              description: "The time for the appointment, in HH:MM format."
            },
            details: {
              type: "string",
              description: "Additional details or requests from the user."
            }
          },
          required: ["date", "time"]
        }
      }
    ];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{"role": "user", "content": "Hi i'd like to book an appointment on March 25th 2025 at 10:00am"}],
      functions: functionDefinitions,
      function_call: "auto"
  });
  
  console.log(completion.choices[0].message);
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
}