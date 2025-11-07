import {Injectable, NotFoundException} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {User, UserDto} from '@pdr-challenge-workspace/shared';

const DATA_FILE_PATH = path.join(process.cwd(), 'apps', 'api', 'src', 'data', 'users.json');

@Injectable()
export class UsersService {

  private users: User[] = [];

  constructor() {
    this.loadInitialData();
  }

  create(createUserDto: UserDto): User {
    const newUser: User = {
      id: this.nextId() as number,
      ...createUserDto
    };
    this.users.push(newUser);
    this.persistData();
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const ret = this.users.find(user => user.id === id);
    // Strictly, we might not want to throw HttpExceptions in the service layer, as this violates
    // Separation of Concern. It would be cleaner to throw a custom exception and let the controller handle it.
    // But in very simple cases like this, simplicity can sometimes trump architectural principles.
    if (!ret) throw new NotFoundException(`User with ID ${id} not found`);
    return ret;
  }

  private loadInitialData() {
    try {
      // readFileSync for synchronous loading at startup
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      this.users = JSON.parse(data) as User[];
      console.log(`Loaded ${this.users.length} users from data file.`);
    } catch (error) {
      console.error('Failed to load users.json:', error);
      // If the file is missing or corrupted, start with no users.
      this.users = [];
    }
  }

  // WARNING: This is a very simple implementation. In a real world application,
  // more care should be taken to avoid collisions with existing IDs.
  // See workspace README.md for more details.
  private nextId(): number {
    // walk through the array and find the highest ID
    return this.users.reduce((max, user)=> {
      return (user.id > max) ? user.id : max;
    }, 0) + 1;
  }

  private persistData() {
    try {
      // ⚠️ Using writeFileSync to lock the main thread for the duration of the write operation.
      // This will perform poorly with large datasets or many concurrent users.
      // A real-world application would require a different approach, see workspace README.md for more details.
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write to users.json:', error);
      // In a real application, you might throw an InternalServerErrorException here.
    }
  }

}
