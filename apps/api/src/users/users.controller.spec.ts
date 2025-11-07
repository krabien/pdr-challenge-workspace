import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to UsersService.create and returns result', async () => {
    const dto = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phoneNumber: '111-111',
      birthDate: '1815-12-10',
      role: 'admin' as const,
    };
    const created = { id: 1, ...dto };
    (usersService.create as jest.Mock).mockReturnValue(created);

    const result = controller.create(dto as any);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('findAll delegates to UsersService.findAll and returns result', () => {
    const users = [
      { id: 1, firstName: 'A', lastName: 'A', birthDate: '2000-01-01', role: 'viewer' as const },
    ];
    (usersService.findAll as jest.Mock).mockReturnValue(users);

    const result = controller.findAll();

    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('findOne converts id to number and delegates to UsersService.findOne', () => {
    const user = { id: 42, firstName: 'X', lastName: 'Y', birthDate: '1990-01-01', role: 'editor' as const };
    (usersService.findOne as jest.Mock).mockReturnValue(user);

    const result = controller.findOne('42');

    expect(usersService.findOne).toHaveBeenCalledWith(42);
    expect(result).toEqual(user);
  });

  it('findOne rethrows NotFoundException from service', () => {
    (usersService.findOne as jest.Mock).mockImplementation(() => {
      throw new NotFoundException('User not found');
    });

    expect(() => controller.findOne('999')).toThrow(NotFoundException);
  });
});
