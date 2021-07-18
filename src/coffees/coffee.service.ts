import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeeService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
    {
      id: 2,
      name: 'Dark Roast',
      brand: 'Nice Brew',
      flavors: ['vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((coffee) => coffee.id === id);
    if (!coffee) {
      // throw new HttpException('No records found', 404);
      throw new NotFoundException();
    }
    return coffee;
  }

  create(coffee: CreateCoffeeDto) {
    this.coffees.push({ id: Math.random(), ...coffee });
    return coffee;
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    let coffee = this.findOne(id);
    if (coffee) {
      coffee.brand = updateCoffeeDto.brand
        ? updateCoffeeDto.brand
        : coffee.brand;
      coffee.name = updateCoffeeDto.name ? updateCoffeeDto.name : coffee.name;
      coffee.flavors = updateCoffeeDto.flavors
        ? updateCoffeeDto.flavors
        : coffee.flavors;
    }
    return coffee;
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id == id);
    console.log('index:', coffeeIndex);
    console.log('before deleting', this.coffees);
    if (coffeeIndex >= 0) {
      console.log('deleting');
      this.coffees.splice(coffeeIndex, 1);
      console.log('after deleting', this.coffees);
    }
  }
}
