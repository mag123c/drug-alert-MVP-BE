import { Module } from '@nestjs/common';
import { FileModule } from 'src/common/file/file.module';
import { ExtractTextController } from './controller/extract-text.controller';
import { ExtractTextService } from './service/extract-text.service';
import { VisionClient } from './service/vision.client';

@Module({
  imports: [FileModule],
  controllers: [ExtractTextController],
  providers: [ExtractTextService, VisionClient]
})
export class VisionModule {}
