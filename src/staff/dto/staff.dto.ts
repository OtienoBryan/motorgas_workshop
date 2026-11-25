import { IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

export class CreateStaffDto {
  @IsString() @MaxLength(255) name: string;
  @IsOptional() @IsString() @MaxLength(255) photo_url?: string;
  @IsString() @MaxLength(50) empl_no: string;
  @IsString() @MaxLength(50) id_no: string;
  @IsString() @MaxLength(255) role: string;
  @IsOptional() @IsString() @MaxLength(255) designation?: string;
  @IsOptional() @IsString() @MaxLength(50) phone_number?: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_POLICY, { message: 'Password must be at least 8 characters with upper-case, lower-case and a number' })
  password: string;

  @IsOptional() @IsString() @MaxLength(100) department?: string;
  @IsOptional() @IsInt() department_id?: number;
  @IsOptional() @IsInt() station_id?: number;
  @IsOptional() @IsEmail() business_email?: string;
  @IsOptional() @IsEmail() department_email?: string;
  @IsOptional() @IsNumber() salary?: number;
  @IsString() @MaxLength(100) employment_type: string;
  @IsIn(['Male', 'Female', 'Other']) gender: 'Male' | 'Female' | 'Other';
  @IsOptional() @IsInt() is_active?: number;
  @IsOptional() @IsString() @MaxLength(200) avatar_url?: string;
  @IsOptional() @IsInt() status?: number;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
