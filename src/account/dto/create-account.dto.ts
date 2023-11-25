import { IsNumber, IsString, isNumber } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  accountId: string;

  @IsString()
  name: string;

  @IsString()
  section: string;
}
