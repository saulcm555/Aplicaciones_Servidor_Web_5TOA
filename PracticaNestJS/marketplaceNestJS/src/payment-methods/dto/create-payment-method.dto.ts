import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  method_name: string;

  @IsString()
  @IsOptional()
  details_payment?: string;
}
