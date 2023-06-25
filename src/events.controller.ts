import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './events.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private events: Event[] = [];

  // @Body(ValidationPipe) using ValidationPipe for a single request
  @Post()
  async createEvent(@Body() input: CreateEventDto): Promise<Event> {
    return await this.eventRepository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return await this.eventRepository.findOneBy({ id });
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });

    return await this.eventRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOne(@Param('id', ParseIntPipe) id: number): Promise<{}> {
    const event = await this.eventRepository.findOneBy({ id });
    await this.eventRepository.remove(event);
    return { message: `Event with id ${id} has been successfully deleted!` };
  }
}
