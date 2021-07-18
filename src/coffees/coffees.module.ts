import { Module } from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CoffeesController } from './coffees.controller';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeeService],
})
export class CoffeesModule {}
