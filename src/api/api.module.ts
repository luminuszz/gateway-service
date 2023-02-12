import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { MessagingModule } from '../messaging/messaging.module';
import { OrderController } from './order.controller';

@Module({
  imports: [MessagingModule],
  controllers: [ApiController, OrderController],
})
export class ApiModule {}
