import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { ExtractTextService } from '../service/extract-text.service';

@Controller('api/v1/extract-text')
export class ExtractTextController {
    constructor(private readonly extractTextService: ExtractTextService) {}

    @Post()
    @UseInterceptors(CustomFileInterceptor)
    async extractTextFromImage(@UploadedFile() file: Express.Multer.File): Promise<any[]> {
        return await this.extractTextService.extractTextFromImage(file?.filename);
    }
}
