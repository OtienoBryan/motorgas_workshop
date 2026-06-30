import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversionVehicleDto {
  @IsNumber()
  @Type(() => Number)
  conversion_client_id: number;

  @IsString()
  @IsNotEmpty()
  registration_number: string;

  @IsOptional()
  @IsString()
  vin_serial_number?: string;

  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsString()
  make?: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsOptional()
  @IsString()
  trim_option?: string;

  @IsOptional()
  @IsString()
  transmission_type?: string;

  @IsOptional()
  @IsString()
  driven_wheel?: string;

  @IsOptional()
  @IsString()
  engine?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  current_odo?: number;

  @IsOptional()
  @IsEnum(['KM', 'Miles'])
  odo_unit?: 'KM' | 'Miles';

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  unit_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;
}
