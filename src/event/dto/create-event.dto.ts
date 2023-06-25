import { Length, IsDateString } from 'class-validator';

export class CreateEventDto {
  @Length(5)
  name: string;

  @Length(5)
  description: string;

  @Length(5, 400, { message: 'Please enter a correct date' })
  @IsDateString()
  when: string;

  @Length(5)
  address: string;
}
