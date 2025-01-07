import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignResponseDto } from './dto/campaign-response.dto';
import { KnowledgeBase } from 'src/entities/knowledgebase.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
    @InjectRepository(KnowledgeBase)
    private knowledgeBasesRepository: Repository<KnowledgeBase>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.create({
      ...createCampaignDto,
      knowledgeBase: { id: createCampaignDto.knowledgeBaseId }
    });
    return await this.campaignsRepository.save(campaign);
  }

  async findAll(): Promise<CampaignResponseDto[]> {
    // Retrieve campaigns with their leads
    const campaigns = await this.campaignsRepository.find({ relations: ['leads'] });

    // Map Campaign entities to CampaignResponseDto
    return campaigns.map((campaign) => {
      const numberOfLeads = campaign.leads.length;
      const convertedLeads = campaign.leads.filter((lead) => lead.status === 'converted').length;
      const conversionRate = numberOfLeads > 0 ? (convertedLeads / numberOfLeads) * 100 : 0;

      return {
        ...campaign,
        numberOfLeads,
        conversionRate,
      };
    });
  }

  async findOne(id: string): Promise<CampaignResponseDto> {
    const campaign = await this.campaignsRepository.findOne({
      where: { id },
      relations: ['leads'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    const numberOfLeads = campaign.leads.length;
    const convertedLeads = campaign.leads.filter((lead) => lead.status === 'converted').length;
    const conversionRate = numberOfLeads > 0 ? (convertedLeads / numberOfLeads) * 100 : 0;

    return {
      ...campaign,
      numberOfLeads,
      conversionRate,
    };
  }

  async update(id: string, updateCampaignDto: Partial<CreateCampaignDto>): Promise<Campaign> {
    const campaign = await this.findOne(id);
    Object.assign(campaign, updateCampaignDto);
    if (updateCampaignDto.knowledgeBaseId) {
      const knowledgeBase = await this.knowledgeBasesRepository.findOne({ where: {id: updateCampaignDto.knowledgeBaseId } });
      if (knowledgeBase) campaign.knowledgeBase = knowledgeBase;
    }
    return await this.campaignsRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const result = await this.campaignsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }
}