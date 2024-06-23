import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicDataModule } from './modules/3rd-party/public-data/public-data.module';
import { VisionModule } from './modules/3rd-party/vision/vision.module';
import { DrugModule } from './modules/drug/drug.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PublicDataModule, VisionModule, DrugModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
