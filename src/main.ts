import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

(async () => {
  const logger = new Logger('Apllication context', { timestamp: true });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    exposedHeaders: [],
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:9000',
      'http://localhost:3008',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = await app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gateway-service-client',

        brokers: [process.env.KAFKA_CONNECT_URL],

        retry: {
          retries: 5,
          maxRetryTime: 5000,
          multiplier: 2,
        },

        ssl: true,
        sasl: {
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
          mechanism: 'plain',
        },
        reauthenticationThreshold: 45000,
      },

      consumer: {
        groupId: 'gateway-service-consumer',
      },
    },
  });

  const PORT = configService.get<number>('API_PORT');

  app.startAllMicroservices().then(() => logger.log('Microservices started'));
  app.listen(PORT).then(() => logger.log(`http is listening on port ${PORT}`));
})();
