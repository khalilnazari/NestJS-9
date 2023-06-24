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

@Controller('/events')
export class EventController {
  private events: CreateEventDto[] = [
    {
      id: 2,
      name: 'Event 2',
      description: 'Educational event for students',
      when: '12-12-2023',
      address: 'Second street',
    },
    {
      id: 1,
      name: 'Event 1',
      description: 'Public event for all',
      when: '12-12-2023',
      address: 'Main street ',
    },
  ];

  @Post()
  createEvent(@Body() input: CreateEventDto) {
    return input;
  }

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return `Event with ${id} is updated`;
  }

  @Patch(':id')
  updateOne(@Param('id') id: number, @Body() input: UpdateEventDto) {
    return {
      message: 'update',
      id,
      input,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  deleteOne(@Param('id') id: number) {
    return `Event with ${id} is deleted`;
  }
}
