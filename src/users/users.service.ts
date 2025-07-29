import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// const users = [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Jane Smith' },
//   { id: 3, name: 'Alice Johnson' },
// ];

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
  getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
  getUserByTgId(tgId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        tg_id: tgId,
      },
    });
  }
  // getUserById(id: number | string): string {
  //   const user = users.find(user => +user.id === +id);
  //   return user ? JSON.stringify(user) : 'User not found';
  // }
  createUser(userDTO: CreateUserDto): boolean {
    this.usersRepository.create(userDTO);
    return true;
  }
}
