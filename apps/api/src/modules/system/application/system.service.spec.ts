import { SystemService } from './system.service';

describe('SystemService', () => {
  let systemService: SystemService;

  beforeEach(() => {
    systemService = new SystemService();
  });

  it('returns the system status contract', () => {
    expect(systemService.getStatus()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ok',
    });
  });

  it('returns the liveness contract', () => {
    expect(systemService.getHealth()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ok',
      checks: {
        api: 'up',
      },
    });
  });

  it('returns the readiness contract', () => {
    expect(systemService.getReadiness()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ready',
      checks: {
        config: 'loaded',
      },
    });
  });
});
