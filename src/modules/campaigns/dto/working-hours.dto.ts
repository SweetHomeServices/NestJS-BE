import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

class WorkingHoursDay {
  @ApiProperty({ example: false })
  @IsBoolean()
  closed: boolean;

  @ApiProperty({ example: '9:00 AM' })
  @IsString()
  opens: string;

  @ApiProperty({ example: '5:00 PM' })
  @IsString()
  closes: string;
}

export class WorkingHours {
  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  monday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  tuesday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  wednesday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  thursday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  friday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  saturday: WorkingHoursDay;

  @ApiProperty({ type: WorkingHoursDay })
  @ValidateNested()
  @Type(() => WorkingHoursDay)
  sunday: WorkingHoursDay;
}