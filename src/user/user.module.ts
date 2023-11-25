import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { Project } from 'src/projects/entities/project.entity';
import { AccountService } from 'src/account/account.service';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Project])],
  controllers: [UserController],
  providers: [UserService, AccountService, ProjectsService],
})
export class UserModule {}
