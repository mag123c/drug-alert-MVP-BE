import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { DrugController } from './drug.controller';
import { DrugService } from './drug.service';

@Module({
  controllers: [DrugController],
  providers: [DrugService],
  imports: [NotificationModule]
})
export class DrugModule {}
