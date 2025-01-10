import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../../entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const { knowledgeBaseId, ...campaignData } = createCampaignDto;
    
    const campaign = this.campaignsRepository.create({
      ...campaignData,
      
      knowledgeBase: { id: knowledgeBaseId }
    });

    return await this.campaignsRepository.save(campaign);
  }

  async findAll(): Promise<Campaign[]> {
    return await this.campaignsRepository.find({
      relations: {
        knowledgeBase: true,
        leads: true
      }
    });
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignsRepository.findOne({
      where: { id },
      relations: {
        knowledgeBase: true,
        leads: true
      }
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    const { knowledgeBaseId, ...updateData } = updateCampaignDto;

    // Update relations if provided
    
    
    if (knowledgeBaseId) {
      campaign.knowledgeBase = { id: knowledgeBaseId } as any;
    }

    // Update other fields
    Object.assign(campaign, updateData);
    
    return await this.campaignsRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const result = await this.campaignsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }
}