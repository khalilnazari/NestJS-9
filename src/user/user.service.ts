import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { AccountService } from 'src/account/account.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly accountService: AccountService,
    private readonly projectService: ProjectsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<InsertResult> {
    const { accountInfo, projectInfo, ...newUser } = createUserDto;

    try {
      const projectExist = await this.projectService.findOne(projectInfo);
      if (JSON.stringify(projectExist).includes(`"status": 404`)) {
        throw new NotFoundException(`Project[${projectInfo}] does not exist`);
      }

      const accountExist = await this.accountService.findOne(accountInfo);
      // if (accountExist.status === 404) {
      //   throw new NotFoundException(`Account[${accountInfo}] does not exist`);
      // }

      const userExist = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });
      if (userExist)
        throw new ConflictException(`User[${createUserDto.email}] exist`);

      const response = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .values([
          {
            ...newUser,
            account: { id: accountInfo },
            project: { id: projectInfo },
          },
        ])
        .execute();

      return response;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      if (!users.length) {
        throw new NotFoundException();
      }
      return users;
    } catch (error) {
      return error;
    }
  }

  async findOne(userId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });

      if (!user) {
        throw new NotFoundException(`User[${userId}] does not exist`);
      }

      return user;
    } catch (error) {
      return error;
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult | User> {
    const { accountInfo, projectInfo, ...userInfo } = updateUserDto;
    try {
      if (projectInfo) {
        const projectExist = await this.projectService.findOne(projectInfo);
        if (JSON.stringify(projectExist).includes(`"status": 404`)) {
          throw new NotFoundException(`Project[${projectInfo}] does not exist`);
        }
      }

      if (accountInfo) {
        const accountExist = await this.accountService.findOne(accountInfo);
        if (JSON.stringify(accountExist).includes('404')) {
          throw new NotFoundException(`Project[${accountInfo}] does not exist`);
        }
      }

      const userExist = await this.findOne(userId);
      if (!userExist) {
        throw new NotFoundException(`User[${userId}] does not exist`);
      }

      const response = await this.usersRepository
        .createQueryBuilder()
        .update()
        .set({
          ...userInfo,
          account: { id: accountInfo },
          project: { id: projectInfo },
        })
        .where('id = :id', { id: userId })
        .execute();

      return response;
    } catch (error) {
      return error;
    }
  }

  async remove(userId: string): Promise<DeleteResult> {
    try {
      const userExist = await this.findOne(userId);
      if (!userExist) throw new NotFoundException();
      return this.usersRepository.delete({ id: userId });
    } catch (error) {
      return error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder()
        .where('email = :email', { email })
        .getOne();

      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      return error;
    }
  }
}
