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
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/event')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private events: Event[] = [];

  // @Body(ValidationPipe) using ValidationPipe for a single request
  @Post()
  async createEvent(@Body() input: CreateEventDto): Promise<Event> {
    const event = await this.eventRepository.save({
      ...input,
      when: new Date(input.when),
    });

    this.logger.debug(`event is created!`);

    return event;
  }

  @Get()
  async findAll(): Promise<Event[]> {
    const events = await this.eventRepository.find();
    this.logger.log(`We've found ${events.length} events`);
    return events;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException({
        message: `Not event associated with this id found. ID=${id}`,
      });
    }

    return event;
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
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException();
    }

    await this.eventRepository.remove(event);
  }
}
