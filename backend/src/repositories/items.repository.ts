import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, desc, like, and } from 'drizzle-orm';
import { items, type Item, type NewItem } from '../db/schema';

@Injectable()
export class ItemsRepository {
  constructor(
    @Inject('DATABASE') private db: any,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.db.select().from(items).where(eq(items.isActive, true)).orderBy(desc(items.createdAt));
  }

  async findById(id: number): Promise<Item | undefined> {
    const [item] = await this.db.select().from(items).where(eq(items.id, id)).limit(1);
    return item;
  }

  async findByName(name: string): Promise<Item[]> {
    return this.db
      .select()
      .from(items)
      .where(like(items.name, `%${name}%`))
      .orderBy(desc(items.createdAt));
  }

  async create(data: NewItem): Promise<Item> {
    const [item] = await this.db.insert(items).values(data).returning();
    return item;
  }

  async update(id: number, data: Partial<NewItem>): Promise<Item | undefined> {
    const [item] = await this.db.update(items).set(data).where(eq(items.id, id)).returning();
    return item;
  }

  async delete(id: number): Promise<boolean> {
    const [item] = await this.db.update(items).set({ isActive: false }).where(eq(items.id, id)).returning();
    return !!item;
  }
}
