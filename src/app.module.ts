import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pgadmin',
      database: 'nestevent',
      entities: [Event],
      synchronize: true,
    }),

    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
