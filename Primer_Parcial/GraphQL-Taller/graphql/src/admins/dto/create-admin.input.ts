import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateAdminInput {
  @Field({ description: 'Admin name' })
  @IsString()
  @IsNotEmpty({ message: 'Admin name is required' })
  admin_name: string;

  @Field({ description: 'Admin email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Admin email is required' })
  admin_email: string;

  @Field({ description: 'Admin password' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  admin_password: string;

  @Field({ nullable: true, description: 'Admin role (e.g., super_admin, admin, moderator)' })
  @IsString()
  @IsOptional()
  role?: string;
}
