import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private readonly accountService: AccountService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // check if account exist
    const { accountInfo, ...newAccount } = createProjectDto;

    try {
      const accountExist = await this.accountService.findOne(accountInfo);
      if (accountExist.status === 404) return new NotFoundException();

      const res = await this.projectRepository
        .createQueryBuilder()
        .insert()
        .values([{ ...newAccount, account: { id: accountInfo } }])
        .execute();

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll() {
    try {
      const projects = await this.projectRepository
        .createQueryBuilder()
        .select()
        .getMany();

      return projects;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectRepository
        .createQueryBuilder()
        .select()
        .where('id=:id', { id })
        .getOne();
      if (!project) return new NotFoundException();
      return project;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { accountInfo, ...rest } = updateProjectDto;

    try {
      const existProject = await this.findOne(id);
      if (existProject.status === 404) return new NotFoundException();

      return await this.projectRepository
        .createQueryBuilder()
        .update()
        .set({ ...rest, account: { id: accountInfo } })
        .where('id=:id', { id })
        .execute();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      const existProject = await this.findOne(id);
      if (existProject.status === 404) return new NotFoundException();

      return await this.projectRepository.delete(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
