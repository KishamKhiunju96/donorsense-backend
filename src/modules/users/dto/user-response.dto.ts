import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from '../users.constants';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier (UUID) of the user' })
  id!: string;

  @Expose()
  @ApiProperty({ description: 'Full name of the user' })
  name!: string;

  @Expose()
  @ApiProperty({ description: 'User email address' })
  email!: string;

  @Expose()
  @ApiProperty({ enum: UserRole, description: 'Role assigned to the user' })
  role!: UserRole;

  @Expose()
  @ApiProperty({ enum: UserStatus, description: 'Account status of the user' })
  status!: UserStatus;

  @Expose()
  @ApiProperty({ description: 'Timestamp when the user account was created' })
  createdAt!: Date;
}
