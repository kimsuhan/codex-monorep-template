import { SystemReadiness } from '../../domain/system-readiness';

export class SystemReadinessResponse implements SystemReadiness {
  readonly name: string;
  readonly status: 'ready';
  readonly checks: {
    config: 'loaded';
  };

  constructor(readiness: SystemReadiness) {
    this.name = readiness.name;
    this.status = readiness.status;
    this.checks = readiness.checks;
  }
}
