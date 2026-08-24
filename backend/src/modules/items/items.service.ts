import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from '../../repositories/items.repository';
import { type NewItem } from '../../db/schema';

@Injectable()
export class ItemsService {
  constructor(
    private itemsRepository: ItemsRepository,
  ) {}

  async create(createItemDto: any): Promise<any> {
    const newItem: NewItem = {
      ...createItemDto,
      price: createItemDto.price.toString(),
      stock: createItemDto.stock || 0,
    };
    return this.itemsRepository.create(newItem);
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
    const item = await this.findById(id);
    
    const updated: Partial<NewItem> = {};
    if (updateItemDto.name !== undefined) updated.name = updateItemDto.name;
    if (updateItemDto.description !== undefined) updated.description = updateItemDto.description;
    if (updateItemDto.price !== undefined) updated.price = updateItemDto.price.toString();
    if (updateItemDto.stock !== undefined) updated.stock = updateItemDto.stock;
    if (updateItemDto.category !== undefined) updated.category = updateItemDto.category;
    if (updateItemDto.barcode !== undefined) updated.barcode = updateItemDto.barcode;
    if (updateItemDto.isActive !== undefined) updated.isActive = updateItemDto.isActive;
    
    return this.itemsRepository.update(id, updated);
  }

  async remove(id: number): Promise<void> {
    const exists = await this.itemsRepository.delete(id);
    if (!exists) {
      throw new NotFoundException(`Item dengan ID ${id} tidak ditemukan`);
    }
  }
}
