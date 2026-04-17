import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { dbDataSourceOptions } from './common/config/db-data-source';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    controllers: [AppController],
    providers: [AppService],
    imports: [
        TypeOrmModule.forRoot(dbDataSourceOptions),
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
    ],
})
export class AppModule {}
