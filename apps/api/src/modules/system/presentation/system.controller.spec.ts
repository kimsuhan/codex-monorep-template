import { Test, TestingModule } from '@nestjs/testing';
import { SystemController } from './controllers/system.controller';
import { SystemService } from '../application/system.service';

describe('SystemController', () => {
  let systemController: SystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [SystemService],
    }).compile();

    systemController = module.get<SystemController>(SystemController);
  });

  it('returns the status payload', () => {
    expect(systemController.getStatus()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ok',
    });
  });

  it('returns the health payload', () => {
    expect(systemController.getHealth()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ok',
      checks: {
        api: 'up',
      },
    });
  });

  it('returns the readiness payload', () => {
    expect(systemController.getReadiness()).toEqual({
      name: 'codex-monorep-template-api',
      status: 'ready',
      checks: {
        config: 'loaded',
      },
    });
  });
});
