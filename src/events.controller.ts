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

@Controller('/events')
export class EventController {
  private events: Event[] = [];

  @Post()
  createEvent(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    this.events.push(event);
    return event;
  }

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const event = this.events.find((event) => event.id === parseInt(id));
    return event;
  }

  @Patch(':id')
  updateOne(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));

    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };

    return this.events[index];
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOne(@Param('id') id) {
    this.events = this.events.filter((event) => event.id !== parseInt(id));
  }
}
