import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: number;

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

  @Column({ type: 'boolean' })
  isActive: string;
}
