import { IsOptional, IsInt, IsEnum, IsNumber, IsString, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJobCardItemDto } from './create-job-card-item.dto';

export class CreateJobCardDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  conversion_client_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  conversion_vehicle_id?: number;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'completed', 'closed'])
  status?: 'open' | 'in_progress' | 'completed' | 'closed';

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  vat_enabled?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vat_rate?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  other_charges?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount_paid?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobCardItemDto)
  items?: CreateJobCardItemDto[];
}
