import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagingModule } from './messaging/messaging.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ScheduleModule.forRoot(), TaskModule, MessagingModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
