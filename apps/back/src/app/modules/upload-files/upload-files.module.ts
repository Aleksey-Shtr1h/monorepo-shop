import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UploadFileEntity} from "./entities/upload-file.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UploadFileEntity]),
    ],
    controllers: [
        UploadFilesController,
    ],
    providers: [
        UploadFilesService,
    ],
})
export class UploadFilesModule {}
