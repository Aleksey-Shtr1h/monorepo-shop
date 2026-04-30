import {
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('upload-files')
export class UploadFilesController {
    constructor(private readonly _uploadFilesService: UploadFilesService) {}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    public async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
            }),
        ) file: Express.Multer.File,
        @Body('folder') folder: string,
    ) {
        const publicPath = await this._uploadFilesService.saveFile(file, folder);
        const savedImage = await this._uploadFilesService.saveImageMetadata(file, folder, publicPath);

        return {
            message: 'Image uploaded successfully',
            imageId: savedImage.id,
            imageUrl: publicPath,
        };
    }
}
