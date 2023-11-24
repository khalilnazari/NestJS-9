import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<Role | InsertResult | ConflictException> {
    try {
      const roleExist = await this.findByRoleId(createRoleDto.roleId);
      if (roleExist) return new ConflictException();

      return await this.roleRepository
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values(createRoleDto)
        .execute();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      const response = await this.roleRepository
        .createQueryBuilder()
        .select()
        .getMany();

      if (response.length) {
        return response;
      }
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number): Promise<Role | NotFoundException> {
    try {
      const response = await this.roleRepository
        .createQueryBuilder('user')
        .select()
        .where('user.id =:id', { id })
        .getOne();

      if (!response) {
        return new NotFoundException();
      }
      return response;
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role | UpdateResult | NotFoundException> {
    try {
      const roleExist = await this.findOne(id);
      if (roleExist.name === 'NotFoundException')
        return new NotFoundException();

      return await this.roleRepository
        .createQueryBuilder()
        .update(Role)
        .set(updateRoleDto)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: number): Promise<DeleteResult | NotFoundException> {
    try {
      const roleExist = await this.findOne(id);
      if (roleExist.name === 'NotFoundException')
        return new NotFoundException();

      return await this.roleRepository
        .createQueryBuilder()
        .delete()
        .from(Role)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      return error;
    }
  }

  async findByRoleId(roleId: number): Promise<boolean> {
    try {
      const role = await this.roleRepository
        .createQueryBuilder('role')
        .where('role.roleId = :roleId', { roleId })
        .getOne();
      if (!role) return false;
      return true;
    } catch (error) {
      return error;
    }
  }
}
