import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { UserService } from 'src/user/user.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly accountSerivce: AccountService,
    private readonly userService: UserService,
    private readonly projectService: ProjectsService,
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
  ): Promise<InsertResult | Ticket> {
    const { accountInfo, projectInfo, userInfo, ...rest } = createTicketDto;

    try {
      // validate account
      if (accountInfo) {
        const accountExist = await this.accountSerivce.findOne(accountInfo);
        if (JSON.stringify(accountExist).includes(`"status": 404`)) {
          console.log('exist');
          throw new NotFoundException(`Account[${accountInfo}] does not exist`);
        }
      }

      // validate user
      if (userInfo) {
        const userExist = await this.userService.findOne(userInfo);
        if (JSON.stringify(userExist).includes(`"status": 404`)) {
          throw new NotFoundException(`User[${userInfo}] does not exist`);
        }
      }

      // validate project
      if (projectInfo) {
        const projectExist = await this.projectService.findOne(projectInfo);
        if (JSON.stringify(projectExist).includes(`"status": 404`)) {
          throw new NotFoundException(
            `Project[${projectExist}] does not exist`,
          );
        }
      }

      const newTicket = await this.ticketRepository.create({
        ...rest,
        account: { id: accountInfo },
        project: { id: projectInfo },
        user: { id: userInfo },
      });
      const res = await this.ticketRepository.save(newTicket);

      // const res = await this.ticketRepository
      //   .createQueryBuilder()
      //   .insert()
      //   .values({
      //     ...rest,
      //     account: { id: accountInfo },
      //     project: { id: projectInfo },
      //     user: { id: userInfo },
      //   })
      //   .execute();

      return res;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.find();
      if (tickets.length < 1) throw new NotFoundException('No ticket found');
      return tickets;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string): Promise<Ticket> {
    try {
      // Using find method
      // const ticketExist = await this.ticketRepository.find({
      //   relations: { account: true, project: true, user: true },
      //   where: { id },
      // });

      // Using QueryBuilder
      const ticketExist = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.account', 'account')
        .leftJoinAndSelect('ticket.user', 'user')
        .leftJoinAndSelect('ticket.project', 'project')
        .where('ticket.id=:id', { id })
        .getOne();

      if (!ticketExist) throw new NotFoundException(`Ticket[${id}] not found`);
      return ticketExist;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket | UpdateResult> {
    const { accountInfo, projectInfo, userInfo, ...rest } = updateTicketDto;
    const updatedTicketObj: UpdateTicketDto = { ...rest };

    try {
      // validate account
      if (accountInfo) {
        const accountExist = await this.accountSerivce.findOne(accountInfo);
        if (JSON.stringify(accountExist).includes(`"status": 404`)) {
          console.log('exist');
          throw new NotFoundException(`Account[${accountInfo}] does not exist`);
        }
        updatedTicketObj.account = { id: accountInfo };
      }

      // validate user
      if (userInfo) {
        const userExist = await this.userService.findOne(userInfo);
        if (JSON.stringify(userExist).includes(`"status": 404`)) {
          throw new NotFoundException(`User[${userInfo}] does not exist`);
        }
        updatedTicketObj.user = { id: userInfo };
      }

      // validate project
      if (projectInfo) {
        const projectExist = await this.projectService.findOne(projectInfo);
        if (JSON.stringify(projectExist).includes(`"status": 404`)) {
          throw new NotFoundException(
            `Project[${projectExist}] does not exist`,
          );
        }
        updatedTicketObj.project = { id: projectInfo };
      }

      const response = await this.ticketRepository
        .createQueryBuilder()
        .update()
        .set(updatedTicketObj)
        .where('id=:id', { id })
        .execute();

      return response;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      const ticketExist = await this.ticketRepository.findOneBy({ id });
      if (!ticketExist) throw new NotFoundException(`Ticket[${id}] not found`);

      return this.ticketRepository.delete(id);
    } catch (error) {
      return error;
    }
  }
}
