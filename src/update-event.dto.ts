import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

// Inhiret CreateEventDto properties and ValidationType properties but optionally
export class UpdateEventDto extends PartialType(CreateEventDto) {}
