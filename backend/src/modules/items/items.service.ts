import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from '../../repositories/items.repository';

@Injectable()
export class ItemsService {
  constructor(
    private itemsRepository: ItemsRepository,
  ) {}

  async create(createItemDto: any): Promise<any> {
    return this.itemsRepository.create(createItemDto);
  }

  async findAll(): Promise<any[]> {
    return this.itemsRepository.findAll();
  }

  async findById(id: number): Promise<any> {
    const item = await this.itemsRepository.findById(id);
    
    if (!item) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan`);
    }
    
    return item;
  }

  async update(id: number, updateItemDto: any): Promise<any> {
    const item = await this.itemsRepository.findById(id);
    
    if (!item) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan`);
    }
    
    return this.itemsRepository.update(id, updateItemDto);
  }

  async remove(id: number): Promise<void> {
    const exists = await this.itemsRepository.delete(id);
    if (!exists) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan`);
    }
  }
}
