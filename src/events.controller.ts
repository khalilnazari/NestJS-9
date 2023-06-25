import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
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

  @Post()
  async createEvent(@Body() input: CreateEventDto) {
    return await this.eventRepository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Get()
  async findAll() {
    return await this.eventRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<Event> {
    return await this.eventRepository.findOneBy({ id });
    //
  }

  @Patch(':id')
  async updateOne(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.eventRepository.findOneBy({ id });

    return await this.eventRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOne(@Param('id') id) {
    const event = await this.eventRepository.findOneBy({ id });
    await this.eventRepository.remove(event);
  }
}
