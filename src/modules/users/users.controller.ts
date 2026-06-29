import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam,
  ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService }    from './users.service';
import { CreateUserDto }   from './dto/create-user.dto';
import { UpdateUserDto }   from './dto/update-user.dto';
import { QueryUserDto }    from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { WrappedApiResponseDto, PaginatedApiResponseDto } from '../../common/swagger/response.swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users', description: 'Returns paginated list. Empty list returns 200, not 404.' })
  @ApiOkResponse({ type: PaginatedApiResponseDto(UserResponseDto) })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'UUID of the user' })
  @ApiOkResponse({ type: WrappedApiResponseDto(UserResponseDto) })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: WrappedApiResponseDto(UserResponseDto) })
  @ApiBadRequestResponse({ description: 'Validation failed — check request body' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: WrappedApiResponseDto(UserResponseDto) })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
