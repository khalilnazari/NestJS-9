import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  isActive: string;

  @IsString()
  role: 'config' | 'admin' | 'developer' | 'staff';

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  accountInfo?: string;

  @IsString()
  projectInfo?: string;

  project: { id: string };
  account: { id: string };
}
