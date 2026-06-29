import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class PaginationMetaDto {
  @ApiProperty() total!:      number;
  @ApiProperty() page!:       number;
  @ApiProperty() limit!:      number;
  @ApiProperty() totalPages!: number;
}

/**
 * Use for single-item responses: GET /users/:id, POST /users
 */
export function WrappedApiResponseDto<T>(DataDto: Type<T>) {
  class WrappedResponse {
    @ApiProperty() success!:   boolean;
    @ApiProperty() message!:   string;
    @ApiProperty({ type: () => DataDto }) data!: T;
    @ApiProperty() timestamp!: string;
  }
  Object.defineProperty(WrappedResponse, 'name', { value: `WrappedResponse<${DataDto.name}>` });
  return WrappedResponse;
}

/**
 * Use for paginated list responses: GET /users
 */
export function PaginatedApiResponseDto<T>(DataDto: Type<T>) {
  class PaginatedResponse {
    @ApiProperty() success!:   boolean;
    @ApiProperty() message!:   string;
    @ApiProperty({ type: () => [DataDto] }) data!: T[];
    @ApiProperty({ type: () => PaginationMetaDto }) meta!: PaginationMetaDto;
    @ApiProperty() timestamp!: string;
  }
  Object.defineProperty(PaginatedResponse, 'name', { value: `PaginatedResponse<${DataDto.name}>` });
  return PaginatedResponse;
}
