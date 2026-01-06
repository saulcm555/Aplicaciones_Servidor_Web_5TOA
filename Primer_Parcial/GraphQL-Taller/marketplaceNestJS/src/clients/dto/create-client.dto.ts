import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  client_name: string;

  @IsEmail()
  @IsNotEmpty()
  client_email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  client_password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;
}
