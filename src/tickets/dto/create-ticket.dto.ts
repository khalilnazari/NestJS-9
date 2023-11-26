import { IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  accountInfo: string;

  @IsString()
  userInfo: string;

  @IsString()
  projectInfo: string;
}
