import { Controller, Get } from '@nestjs/common';
import { SystemService } from '../../application/system.service';
import { SystemHealthResponse } from '../responses/system-health.response';
import { SystemReadinessResponse } from '../responses/system-readiness.response';
import { SystemStatusResponse } from '../responses/system-status.response';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('status')
  getStatus(): SystemStatusResponse {
    return new SystemStatusResponse(this.systemService.getStatus());
  }

  @Get('health')
  getHealth(): SystemHealthResponse {
    return new SystemHealthResponse(this.systemService.getHealth());
  }

  @Get('ready')
  getReadiness(): SystemReadinessResponse {
    return new SystemReadinessResponse(this.systemService.getReadiness());
  }
}
