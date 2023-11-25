import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Account])],
  controllers: [ProjectsController],
  providers: [ProjectsService, AccountService],
})
export class ProjectsModule {}
