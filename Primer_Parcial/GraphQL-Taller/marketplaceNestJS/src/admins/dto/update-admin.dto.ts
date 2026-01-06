import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  admin_name?: string;

  @IsOptional()
  @IsEmail()
  admin_email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  admin_password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
