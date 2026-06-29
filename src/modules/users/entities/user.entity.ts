import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserRole, UserStatus } from '../users.constants';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column()
  @Exclude()          // never returned in API responses
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;
}
