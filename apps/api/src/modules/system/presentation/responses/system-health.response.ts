import { SystemHealth } from '../../domain/system-health';

export class SystemHealthResponse implements SystemHealth {
  readonly name: string;
  readonly status: 'ok';
  readonly checks: {
    api: 'up';
  };

  constructor(health: SystemHealth) {
    this.name = health.name;
    this.status = health.status;
    this.checks = health.checks;
  }
}
