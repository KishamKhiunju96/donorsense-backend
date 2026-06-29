import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags, ApiOperation,
  ApiOkResponse, ApiCreatedResponse,
  ApiUnauthorizedResponse, ApiBadRequestResponse, ApiConflictResponse,
} from '@nestjs/swagger';
import { Public }          from '../../common/decorators/public.decorator';
import { AuthService }     from './auth.service';
import { LoginDto }        from './dto/login.dto';
import { RegisterDto }     from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { WrappedApiResponseDto } from '../../common/swagger/response.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: WrappedApiResponseDto(AuthResponseDto) })
  @ApiBadRequestResponse({ description: 'Validation failed — check request body' })
  @ApiConflictResponse({ description: 'Email already in use' })
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT tokens' })
  @ApiOkResponse({ type: WrappedApiResponseDto(AuthResponseDto) })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBadRequestResponse({ description: 'Validation failed — check request body' })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiOkResponse({ type: WrappedApiResponseDto(AuthResponseDto) })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  refresh(@Body('refreshToken') token: string): Promise<AuthResponseDto> {
    return this.authService.refresh(token);
  }
}
