import { Account } from 'src/account/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity('Ticket')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  type: string;

  @ManyToOne(() => Account, (account) => account.tickets)
  account?: Account;

  @ManyToOne(() => Project, (project) => project.tickets)
  project?: Project;

  @ManyToOne(() => User, (user) => user.tickets)
  user?: User;
}
