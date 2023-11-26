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

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
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
