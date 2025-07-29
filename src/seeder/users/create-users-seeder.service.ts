import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';

const usersMock: CreateUserDto[] = [
  { tg_id: 1, name: 'John Doe' },
  { tg_id: 2, name: 'Jane Smith' },
  { tg_id: 3, name: 'Alice Johnson' },
];

@Injectable()
export class CreateUsersSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async seed(): Promise<User[]> {
    const existing = await this.userRepo.count();
    if (existing === 0) {
      const arr = usersMock.map((user: CreateUserDto) => {
        return this.userRepo.create(user);
      });
      const result = await this.userRepo.save(arr);
      return result;
    }
    return this.userRepo.find();
  }
}
