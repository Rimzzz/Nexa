import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async create(createItemDto: any): Promise<any> {
    const item = this.itemsRepository.create(createItemDto);
    return this.itemsRepository.save(item);
  }

  async findAll(): Promise<any[]> {
    return this.itemsRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<any> {
    const item = await this.itemsRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan`);
    }
    return item;
  }

  async update(id: number, updateItemDto: any): Promise<any> {
    const item = await this.findById(id);
    Object.assign(item, updateItemDto);
    return this.itemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findById(id);
    item.isActive = false;
    await this.itemsRepository.save(item);
  }
}
