import { IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  accountInfo: string;
}
