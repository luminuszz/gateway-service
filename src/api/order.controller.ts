import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-.dto';
import { RefreshOrderTrakingDto } from './dto/refresh-order-traking.dto';
import { map } from 'rxjs/operators';
import { Order, parseOrder } from './models/order.model';
import { KafkaService } from '../messaging/kafka.service';

@Controller({
  version: '1',
  path: 'orders',
})
export class OrderController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post()
  async createOrder(
    @Body() { traking_code, recipient_id, name }: CreateOrderDto,
  ) {
    this.kafkaService.emit('traking.create-order', {
      traking_code,
      recipient_id,
      name,
    });
  }

  @Get('refresh-status/:order_id')
  async refreshOrderTraking(@Param() { order_id }: RefreshOrderTrakingDto) {
    this.kafkaService.emit('traking.refresh-order-traking', {
      order_id,
    });
  }

  @Get()
  async findAllOrders() {
    return this.kafkaService
      .send('traking.find-all-orders', {})
      .pipe(map((response: Order[]) => response.map(parseOrder)));
  }
}
