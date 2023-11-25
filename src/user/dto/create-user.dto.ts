import { IsEmail, IsString } from 'class-validator';

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
  accountInfo?: string;

  @IsString()
  projectInfo?: string;
}
