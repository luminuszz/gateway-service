import { ClientKafka } from '@nestjs/microservices';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'gateway-service-client',
        brokers: [config.get<string>('KAFKA_CONECT_URL')],
        connectionTimeout: 5000,
        retry: {
          retries: 5,
          multiplier: 2,
          restartOnFailure: async (e) => {
            Logger.error(e);
            return true;
          },
        },
      },

      consumer: {
        groupId: 'gateway-service-consumer',
      },
    });
  }

  async onModuleInit() {
    this.subscribeToResponseOf('document.findAllWithUnfollowStatus');
    this.subscribeToResponseOf('document.findAllUnread');
    this.subscribeToResponseOf('document.getById');
    this.subscribeToResponseOf('traking.find-all-orders');

    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
