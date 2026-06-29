import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { SkipTransform } from './common/decorators/skip-transform.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @SkipTransform()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Application is running' })
  healthCheck(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

