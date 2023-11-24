import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('Event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event)
  attendees: Attendee[];
}
