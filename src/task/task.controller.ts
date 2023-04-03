import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async initTask() {
    await this.taskService.startComicsJobsTask();
  }

  @Get('sync')
  async syncTaskDatabaseJob() {
    await this.taskService.startSyncDatabaseBatch();
  }

  @Get('refresh-orders')
  async refreshOrderStatus() {
    await this.taskService.startRefreshOrderStatusBatch();
  }

  @Get('refresh-class-room')
  async refreshClassRoom() {
    await this.taskService.startRefreshClassRoomJob();
  }
}
