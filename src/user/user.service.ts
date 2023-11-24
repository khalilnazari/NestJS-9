import { Injectable } from '@nestjs/common';
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

  create(createUserDto: CreateUserDto): Promise<InsertResult> {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
      .execute();
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ userId: id });
  }

  update(userId: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('userId = :userId', { userId });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete({ userId: id });
  }
}
