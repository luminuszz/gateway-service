import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagingModule } from '../messaging/messaging.module';
import { TaskController } from './task.controller';

@Module({
  imports: [MessagingModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
