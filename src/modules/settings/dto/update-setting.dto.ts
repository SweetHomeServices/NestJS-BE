import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'email_templates', description: 'Setting key', required: false })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({ example: { welcome: 'Welcome template' }, description: 'Setting value', required: false })
  @IsOptional()
  value?: Record<string, any>;

  @ApiProperty({ example: 'Email templates configuration', description: 'Setting description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}