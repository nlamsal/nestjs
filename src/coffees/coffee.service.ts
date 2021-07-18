import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      // throw new HttpException('No records found', 404);
      throw new NotFoundException();
    }
    return coffee;
  }

  async create(coffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      coffeeDto.flavors.map((name) => this.preloadFlavorName(name)),
    );

    const coffee = this.coffeeRepository.create({ ...coffeeDto, flavors });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    // let coffee = this.findOne(id);
    // if (coffee) {
    //   coffee.brand = updateCoffeeDto.brand
    //     ? updateCoffeeDto.brand
    //     : coffee.brand;
    //   coffee.name = updateCoffeeDto.name ? updateCoffeeDto.name : coffee.name;
    //   coffee.flavors = updateCoffeeDto.flavors
    //     ? updateCoffeeDto.flavors
    //     : coffee.flavors;
    // }
    // return coffee;
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(
        `Coffee ${updateCoffeeDto.name} not found in database.`,
      );
    }
    this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    // const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id == id);
    // console.log('index:', coffeeIndex);
    // console.log('before deleting', this.coffees);
    // if (coffeeIndex >= 0) {
    //   console.log('deleting');
    //   this.coffees.splice(coffeeIndex, 1);
    //   console.log('after deleting', this.coffees);
    // }
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorName(name: string) {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }

  // private async getFlavors(coffeeDto) {
  //   return await Promise.all(
  //     coffeeDto.flavors.map((name) => this.preloadFlavorName(name)),
  //   );
  // }
}
