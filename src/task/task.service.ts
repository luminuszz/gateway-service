import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KafkaService } from '../messaging/kafka.service';

type Order = {
  _id: string;
};

@Injectable()
export class TaskService {
  constructor(private readonly kafka: KafkaService) {}

  private logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_6_HOURS, {
    timeZone: 'America/Bahia',
  })
  async startComicsJobsTask() {
    this.logger.log('Start comics jobs task');

    this.kafka.emit('tasks.jobs.findForNewChapters', {});
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async startSyncDatabaseBatch() {
    this.logger.log('Start sync database batch');

    this.kafka.emit('tasks.jobs.syncDatabase', {});
  }

  @Cron(CronExpression.EVERY_2_HOURS, { timeZone: 'America/Bahia' })
  async startRefreshOrderStatusBatch() {
    this.logger.log('Start refresh order status batch');

    this.kafka
      .send('traking.find-all-pending-orders', {})
      .subscribe((response: Order[]) => {
        for (const { _id } of response) {
          this.kafka.emit('tasks.refresh-order-status', {
            order_id: _id,
          });
        }
      });
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_12PM)
  async startRefreshClassRoomJob() {
    this.kafka.emit('tasks.jobs.findForNewClassRoomToday', {});
  }
}
