import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { User }            from './entities/user.entity';
import { CreateUserDto }   from './dto/create-user.dto';
import { UpdateUserDto }   from './dto/update-user.dto';
import { QueryUserDto }    from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { PaginatedResponse } from '../../common/types';
import { USER_ERRORS }     from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto): Promise<PaginatedResponse<UserResponseDto>> {
    const { page, limit, search, role, status, order } = query;

    const qb = this.usersRepo.createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }
    if (role)   qb.andWhere('user.role = :role', { role });
    if (status) qb.andWhere('user.status = :status', { status });

    qb.orderBy('user.createdAt', order).skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data:       plainToInstance(UserResponseDto, items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);
    return plainToInstance(UserResponseDto, user);
  }

  async findOneRaw(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException(USER_ERRORS.EMAIL_EXISTS);

    const user = this.usersRepo.create(dto);
    const saved = await this.usersRepo.save(user);
    return plainToInstance(UserResponseDto, saved);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);

    Object.assign(user, dto);
    const saved = await this.usersRepo.save(user);
    return plainToInstance(UserResponseDto, saved);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(USER_ERRORS.NOT_FOUND);
    await this.usersRepo.softDelete(id);
  }
}
