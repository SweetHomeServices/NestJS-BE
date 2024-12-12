import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingsRepository.create(createSettingDto);
    return await this.settingsRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    return await this.settingsRepository.find();
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return setting;
  }

  async findByKey(key: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }

    return setting;
  }

  async update(id: string, updateSettingDto: Partial<CreateSettingDto>): Promise<Setting> {
    const setting = await this.findOne(id);
    Object.assign(setting, updateSettingDto);
    return await this.settingsRepository.save(setting);
  }

  async remove(id: string): Promise<void> {
    const result = await this.settingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
  }
}