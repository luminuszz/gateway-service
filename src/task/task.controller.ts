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
}
