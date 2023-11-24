import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
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

    UserModule,

    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
