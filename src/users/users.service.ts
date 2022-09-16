import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(userId: number) {
    return this.repo.findOneBy({
      id: userId,
    });
  }

  find(email: string) {
    return this.repo.find({
      where: {
        email: email,
      },
    });
  }

  async updateUser(userId: number, userData: Partial<User>) {
    let user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`user with id: ${userId} not found`);
    }
    Object.assign(user, userData);
    return this.repo.save(user);
  }

  async removeUser(userId: number) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`user with id: ${userId} not found`);
    }

    return this.repo.remove(user);
  }
}
