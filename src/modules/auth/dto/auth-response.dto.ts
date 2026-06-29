import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Short-lived JWT access token', example: 'eyJhbG...' })
  accessToken!: string;

  @ApiProperty({ description: '7-day JWT refresh token', example: 'eyJhbG...' })
  refreshToken!: string;
}
