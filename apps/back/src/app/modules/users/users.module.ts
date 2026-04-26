import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/usersEntity';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity]),
        JwtModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
