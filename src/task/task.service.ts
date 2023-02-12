import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindAllUnreadResponseDto } from './dto/find-all-unread-response.dto';
import { FindComicCapByUrlEvent } from './dto/find-comicby-url-event.dto';
import { KafkaService } from '../messaging/kafka.service';

@Injectable()
export class TaskService {
  constructor(private readonly kafka: KafkaService) {}

  private logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_30_MINUTES, {
    timeZone: 'America/Bahia',
  })
  async startComicsJobsTask() {
    this.logger.log('Start comics jobs task');

    this.kafka
      .send('document.findAllUnread', {})
      .subscribe((response: FindAllUnreadResponseDto[]) => {
        const commics = response.map<FindComicCapByUrlEvent>(({ props }) => ({
          url: props.url,
          name: props.name,
          cap: props.cap,
          id: props.id,
        }));

        this.kafka.emit('tasks.jobs.findForNewChapters', commics);
      });
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async startSyncDatabaseBatch() {
    this.logger.log('Start sync database batch');

    this.kafka.emit('tasks.jobs.syncDatabase', {});
  }
}
