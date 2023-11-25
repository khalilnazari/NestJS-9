import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';

export default registerAs(
  'orm.config.local',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    entities: [User, Role, Account, Project],
    synchronize: true,
  }),
);
