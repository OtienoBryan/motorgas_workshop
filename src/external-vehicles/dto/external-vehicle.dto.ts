import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsInt, IsEmail, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { EXTERNAL_VEHICLE_FUEL_TYPES } from '../../entities/external-vehicle.entity';
import type { ExternalVehicleFuelType } from '../../entities/external-vehicle.entity';

export class CreateExternalVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registration_number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  make: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  model: string;

  @IsIn(EXTERNAL_VEHICLE_FUEL_TYPES as unknown as string[])
  fuel_type: ExternalVehicleFuelType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @Type(() => Number)
  @IsInt()
  owner_id: number;
}

export class UpdateExternalVehicleDto extends PartialType(CreateExternalVehicleDto) {}

export class CreateExternalVehicleOwnerDto {
  @IsIn(['individual', 'company', 'sacco'])
  ownership_type: 'individual' | 'company' | 'sacco';

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  id_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_person?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateExternalVehicleOwnerDto extends PartialType(CreateExternalVehicleOwnerDto) {}
