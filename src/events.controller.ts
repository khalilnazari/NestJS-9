import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

@Controller('/events')
export class EventController {
  @Post()
  createEvent(@Body() body) {
    return body;
  }

  @Get()
  findAll() {
    return [
      {
        id: 2,
        name: 'Event 2',
        when: '12-12-2023',
      },
      {
        id: 1,
        name: 'Event 1',
        when: '12-12-2023',
      },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return `Event with ${id} is updated`;
  }

  @Patch(':id')
  updateOne(@Param('id') id: number, @Body() input) {
    return {
      message: 'update',
      id,
      input,
    };
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return `Event with ${id} is deleted`;
  }
}
