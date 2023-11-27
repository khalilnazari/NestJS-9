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
    const projectDTO = { ...newAccount };

    try {
      const accountExist = await this.accountService.findOne(accountInfo);
      if (JSON.stringify(accountExist).includes(`"status": 404`))
        throw new NotFoundException();

      if (accountInfo) {
        projectDTO.account = { id: accountInfo };
      }

      const res = await this.projectRepository
        .createQueryBuilder()
        .insert()
        .values([projectDTO])
        .execute();

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      // const projects = await this.projectRepository
      //   .createQueryBuilder()
      //   .select()
      //   .getMany();

      const projects = await this.projectRepository.find();

      return projects;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findOne(id: string): Promise<Project> {
    try {
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.account', 'account')
        .where('project.id=:id', { id })
        .getOne();

      // Using findOne method
      // const project = await this.projectRepository.findOne({
      //   where: { id },
      //   relations: {
      //     account: true,
      //   },
      // });

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
    const projectDTO = { ...rest };

    try {
      const existProject = await this.findOne(id);
      if (JSON.stringify(existProject).includes(`"status": 404`))
        throw new NotFoundException();

      if (accountInfo) {
        projectDTO.account = { id: accountInfo };
      }

      return await this.projectRepository
        .createQueryBuilder()
        .update()
        .set(projectDTO)
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
