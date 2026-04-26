import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { UploadFileEntity } from "./entities/upload-file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import fs from "fs";
import { join } from "path";

@Injectable()
export class UploadFilesService {
    constructor(
        @InjectRepository(UploadFileEntity) private _imageRepository: Repository<UploadFileEntity>,
    ) {}

    public async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
        // Базовый путь к папке uploads в корне проекта
        const baseDir = join(process.cwd(), 'apps/back', 'uploads');
        const targetDir = join(baseDir, folder);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${file.originalname}`;
        const filePath = join(targetDir, filename);
        fs.writeFileSync(filePath, file.buffer);


        return `/uploads/${folder}/${filename}`;
    }

    public async saveImageMetadata(file: Express.Multer.File, folder: string, path: string): Promise<UploadFileEntity> {
        const image = this._imageRepository.create({
            filename: file.originalname,
            originalName: file.originalname,
            path: path,
            mimetype: file.mimetype,
            size: file.size,
            folder: folder,
        });


        return this._imageRepository.save(image);
    }

    public async getAllImages(folder?: string): Promise<UploadFileEntity[]> {
        if (folder) {
            return this._imageRepository.find({ where: { folder } });
        }
        return this._imageRepository.find();
    }
}
