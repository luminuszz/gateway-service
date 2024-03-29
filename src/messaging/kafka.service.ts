import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    super({
      client: {
        clientId: 'gateway-service-client',
        brokers: [config.get<string>('KAFKA_CONNECT_URL')],
        connectionTimeout: 5000,
        retry: {
          retries: 5,
          multiplier: 2,
          restartOnFailure: async (e) => {
            Logger.error(e);
            return true;
          },
        },
        ssl: true,
        sasl: {
          username: config.get<string>('KAFKA_USERNAME'),
          password: config.get<string>('KAFKA_PASSWORD'),
          mechanism: 'plain',
        },
        reauthenticationThreshold: 45000,
      },

      consumer: {
        groupId: 'gateway-service-consumer',
      },
    });
  }

  async onModuleInit() {
    this.subscribeToResponseOf('document.findAllWithUnfollowStatus');
    this.subscribeToResponseOf('document.getById');
    this.subscribeToResponseOf('traking.find-all-orders');
    this.subscribeToResponseOf('traking.find-all-pending-orders');

    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }
}
