import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeBase } from '../../entities/knowledgebase.entity';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepository: Repository<KnowledgeBase>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createKnowledgeBaseDto: CreateKnowledgeBaseDto, 
    file?: Express.Multer.File,
  ): Promise<KnowledgeBase> {
    const { campaignId, ...knowledgeBaseData } = createKnowledgeBaseDto;
    const knowledgeBase = this.knowledgeBaseRepository.create(knowledgeBaseData);
    
    if (campaignId) {
      knowledgeBase.campaigns = [{ id: campaignId } as any];
    }

    if (file) {
      // Upload the file to S3
      const s3Key = await this.s3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
      knowledgeBase.s3Key = s3Key;
    }


    return await this.knowledgeBaseRepository.save(knowledgeBase);
  }

  async findAll(): Promise<KnowledgeBase[]> {
    return await this.knowledgeBaseRepository.find({
      relations: ['campaigns'],
    });
  }

  async findOne(id: string): Promise<KnowledgeBase> {
    const knowledgeBase = await this.knowledgeBaseRepository.findOne({
      where: { id },
      relations: ['campaigns'],
    });

    if (!knowledgeBase) {
      throw new NotFoundException(`Knowledge base with ID ${id} not found`);
    }

    return knowledgeBase;
  }

  async update(id: string, 
    updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
    file?: Express.Multer.File,): Promise<KnowledgeBase> {
    const knowledgeBase = await this.findOne(id);
    const { campaignId, ...updateData } = updateKnowledgeBaseDto;

    if (campaignId) {
      knowledgeBase.campaigns = [{ id: campaignId } as any];
    }

    Object.assign(knowledgeBase, updateData);

    if (file) {
      // optional: if (kb.s3Key) { await this.s3Service.deleteFile(kb.s3Key); }
      const s3Key = await this.s3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
      knowledgeBase.s3Key = s3Key;
    }

    return await this.knowledgeBaseRepository.save(knowledgeBase);
  }

  async remove(id: string): Promise<void> {
    const result = await this.knowledgeBaseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Knowledge base with ID ${id} not found`);
    }
  }
}