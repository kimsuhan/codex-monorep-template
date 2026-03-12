import { SystemStatus } from '../../domain/system-status';

export class SystemStatusResponse implements SystemStatus {
  readonly name: string;
  readonly status: 'ok';

  constructor(status: SystemStatus) {
    this.name = status.name;
    this.status = status.status;
  }
}
