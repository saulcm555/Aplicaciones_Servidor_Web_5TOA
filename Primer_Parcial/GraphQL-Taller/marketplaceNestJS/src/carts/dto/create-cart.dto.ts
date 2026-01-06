import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  id_client: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;
}
