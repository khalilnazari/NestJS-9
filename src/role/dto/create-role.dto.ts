import { IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNumber()
  roleId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
