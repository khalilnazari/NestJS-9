import { Account } from 'src/account/entities/account.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar' })
  isActive: string;

  @ManyToOne(() => Account, (account) => account.users)
  account: Account;

  @ManyToOne(() => Project, (project) => project.users)
  project: Project;
}
