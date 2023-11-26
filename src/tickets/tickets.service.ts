import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const { accountInfo, projectInfo, userInfo, ...rest } = createTicketDto;
    // validate user
    // validate account
    // validate project

    try {
      const newTicket = await this.ticketRepository.create({
        ...rest,
        account: { id: accountInfo },
        project: { id: projectInfo },
        user: { id: userInfo },
      });

      return this.ticketRepository.save(newTicket);
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const tickets = await this.ticketRepository.find();
      if (tickets.length < 1) return new NotFoundException('No ticket found');
      return tickets;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const ticketExist = await this.ticketRepository.findOneBy({ id });
      if (!ticketExist) return new NotFoundException(`Ticket[${id}] not found`);
      return ticketExist;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const { accountInfo, projectInfo, userInfo, ...rest } = updateTicketDto;

    try {
      const response = await this.ticketRepository
        .createQueryBuilder()
        .update()
        .set({
          ...rest,
          account: { id: accountInfo },
          project: { id: projectInfo },
          user: { id: userInfo },
        })
        .where('id=:id', { id })
        .execute();

      return response;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      const ticketExist = await this.ticketRepository.findOneBy({ id });
      if (!ticketExist) return new NotFoundException(`Ticket[${id}] not found`);

      return this.ticketRepository.delete(id);
    } catch (error) {
      return error;
    }
  }
}
