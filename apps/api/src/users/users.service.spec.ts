import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

// Mock the 'fs' module used inside UsersService to avoid real file I/O
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

import * as fs from 'fs';

describe('UsersService', () => {
  let service: UsersService;

  const initialUsers = [
    {
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phoneNumber: '111-111',
      birthDate: '1815-12-10',
      role: 'admin',
    },
    {
      id: 2,
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
      phoneNumber: '222-222',
      birthDate: '1912-06-23',
      role: 'editor',
    },
  ];

  beforeEach(async () => {
    // Set up fs mocks for each test
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(initialUsers)
    );
    (fs.writeFileSync as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loads initial data on construction and returns all users', () => {
    const all = service.findAll();
    expect(all).toHaveLength(2);
    expect(all).toEqual(initialUsers);
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it('findOne returns the matching user when it exists', () => {
    const user = service.findOne(2);
    expect(user).toEqual(initialUsers[1]);
  });

  it('findOne throws NotFoundException when user does not exist', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('create adds a new user with incremented id and persists to disk', () => {
    const newDto = {
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      phoneNumber: '333-333',
      birthDate: '1906-12-09',
      role: 'viewer' as const,
    };

    const created = service.create(newDto);

    // id should be max(existing ids)+1 => 3
    expect(created.id).toBe(3);
    expect(created).toEqual({ id: 3, ...newDto });

    // findAll should now include the new user
    const all = service.findAll();
    expect(all).toHaveLength(3);
    expect(all[2]).toEqual({ id: 3, ...newDto });

    // persistData should have attempted to write the file
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    // Validate the content written contains the new user
    const args = (fs.writeFileSync as jest.Mock).mock.calls[0];
    // args[0] is the file path, args[1] is the JSON string
    const written = JSON.parse(args[1]);
    expect(written).toEqual(all);
  });
});
