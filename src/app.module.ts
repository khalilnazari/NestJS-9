import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event/event.entity';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import orgmConfigLocal from './config/orgm.config.local';
import orgmConfigProd from './config/orgm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [orgmConfigLocal],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production'
          ? orgmConfigLocal
          : orgmConfigProd,
    }),

    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
