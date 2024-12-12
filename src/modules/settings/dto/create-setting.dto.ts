import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({ example: 'email_templates', description: 'Setting key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: { welcome: 'Welcome template' }, description: 'Setting value' })
  @IsNotEmpty()
  value: Record<string, any>;

  @ApiProperty({ example: 'Email templates configuration', description: 'Setting description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}