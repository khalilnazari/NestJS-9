import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private readonly accountService: AccountService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
  ): Promise<InsertResult | Project> {
    // check if account exist
    const { accountInfo, ...newAccount } = createProjectDto;

    try {
      const accountExist = await this.accountService.findOne(accountInfo);
      if (JSON.stringify(accountExist).includes(`"status": 404`))
        throw new NotFoundException();

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

  async findAll(): Promise<Project[]> {
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

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepository
        .createQueryBuilder()
        .select()
        .where('id=:id', { id })
        .getOne();
      if (!project) throw new NotFoundException();
      return project;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<UpdateResult | Project> {
    const { accountInfo, ...rest } = updateProjectDto;

    try {
      const existProject = await this.findOne(id);
      if (JSON.stringify(existProject).includes(`"status": 404`))
        throw new NotFoundException();

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

  async remove(id: string): Promise<DeleteResult> {
    try {
      const existProject = await this.findOne(id);
      if (JSON.stringify(existProject).includes(`"status": 404`))
        throw new NotFoundException();

      return await this.projectRepository.delete(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
