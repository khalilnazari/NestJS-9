import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<InsertResult | ConflictException> {
    try {
      const user = await this.findByEmail(createUserDto.email);
      console.log(user);
      if (user) {
        return new ConflictException();
      }

      return await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserDto)
        .execute();
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<User[] | NotFoundException> {
    try {
      const users = await this.usersRepository.find();
      if (!users.length) {
        return new NotFoundException();
      }
      return users;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string): Promise<User | NotFoundException> {
    try {
      const user = await this.usersRepository.findOneBy({ userId: id });

      if (!user) {
        return new NotFoundException();
      }

      return user;
    } catch (error) {
      return error;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const userExist = await this.findOne(userId);
      if (!userExist) {
        return new NotFoundException();
      }

      return await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where('userId = :userId', { userId })
        .execute();
    } catch (error) {
      return error;
    }
  }

  async remove(id: string): Promise<DeleteResult | NotFoundException> {
    try {
      const userExist = await this.findOne(id);
      if (!userExist) return new NotFoundException();
      return this.usersRepository.delete({ userId: id });
    } catch (error) {
      return error;
    }
  }

  async findByEmail(email: string): Promise<User | NotFoundException> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) return new NotFoundException();
      return user;
    } catch (error) {
      return error;
    }
  }
}
