import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { dbDataSourceOptions } from './common/config/db-data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadFilesModule } from './modules/upload-files/upload-files.module';
import { TestGateway } from './modules/test/test.gateway';

@Module({
    controllers: [ AppController ],
    providers: [
        AppService,
        TestGateway,
    ],
    imports: [
        TypeOrmModule.forRoot(dbDataSourceOptions),
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
        UploadFilesModule,
    ],
})
export class AppModule {}
