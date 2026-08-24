import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, desc, between, like } from 'drizzle-orm';
import { users, type User, type NewUser } from '../db/schema';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DATABASE') private db: any,
  ) {}

  async findAll(): Promise<User[]> {
    return this.db.select().from(users).orderBy(desc(users.createdAt));
  }

  async findById(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  async update(id: number, data: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async delete(id: number): Promise<boolean> {
    const [user] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return !!user;
  }
}
