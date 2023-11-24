import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  roleId: number;

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;
}
