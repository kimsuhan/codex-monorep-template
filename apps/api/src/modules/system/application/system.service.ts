import { Injectable, Optional } from '@nestjs/common';
import { SystemHealth } from '../domain/system-health';
import { SystemReadiness } from '../domain/system-readiness';
import { SystemStatus } from '../domain/system-status';
import { SystemRuntimeMetadata } from '../infrastructure/system-runtime-metadata';

@Injectable()
export class SystemService {
  constructor(
    @Optional()
    private readonly runtimeMetadata: SystemRuntimeMetadata = new SystemRuntimeMetadata(),
  ) {}

  getStatus(): SystemStatus {
    return {
      name: this.runtimeMetadata.getAppName(),
      status: 'ok',
    };
  }

  getHealth(): SystemHealth {
    return {
      name: this.runtimeMetadata.getAppName(),
      status: 'ok',
      checks: {
        api: 'up',
      },
    };
  }

  getReadiness(): SystemReadiness {
    return {
      name: this.runtimeMetadata.getAppName(),
      status: 'ready',
      checks: {
        config: 'loaded',
      },
    };
  }
}
