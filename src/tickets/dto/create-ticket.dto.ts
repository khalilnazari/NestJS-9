import { IsString, ValidateNested } from 'class-validator';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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

  @ValidateNested()
  project?: { id: string };
  account?: { id: string };
  user?: { id: string };
}
