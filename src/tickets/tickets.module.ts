import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { AccountService } from 'src/account/account.service';
import { UserService } from 'src/user/user.service';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Project, Account, User])],
  controllers: [TicketsController],
  providers: [TicketsService, AccountService, UserService, ProjectsService],
})
export class TicketsModule {}
