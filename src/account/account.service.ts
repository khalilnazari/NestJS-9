import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<Account | InsertResult | ConflictException> {
    try {
      return await this.accountRepository
        .createQueryBuilder()
        .insert()
        .into(Account)
        .values(createAccountDto)
        .execute();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(): Promise<Account[]> {
    try {
      return await this.accountRepository.createQueryBuilder().getMany();
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.accountRepository.findOneBy({ id });
      if (!account) return new NotFoundException();
      return account;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    try {
      const account = await this.accountRepository.findOneBy({ id });
      if (!account) return new NotFoundException();
      return await this.accountRepository
        .createQueryBuilder()
        .update()
        .set(updateAccountDto)
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      return error;
    }
  }

  async remove(
    id: string,
  ): Promise<Account | DeleteResult | NotFoundException> {
    try {
      const account = await this.accountRepository.findOneBy({ id });
      if (!account) return new NotFoundException();
      return await this.accountRepository
        .createQueryBuilder()
        .delete()
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      return error;
    }
  }
}
