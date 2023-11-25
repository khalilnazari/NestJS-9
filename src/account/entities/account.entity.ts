import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Account')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @PrimaryColumn({ type: 'varchar', unique: true })
  // accountId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  section: string;

  @OneToMany(() => Project, (projects) => projects.account)
  projects: Project[];

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
