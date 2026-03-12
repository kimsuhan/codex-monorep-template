import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/system/status (GET)', () => {
    return request(app.getHttpServer())
      .get('/system/status')
      .expect(200)
      .expect({
        name: 'codex-monorep-template-api',
        status: 'ok',
      });
  });

  it('/system/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/system/health')
      .expect(200)
      .expect({
        name: 'codex-monorep-template-api',
        status: 'ok',
        checks: {
          api: 'up',
        },
      });
  });

  it('/system/ready (GET)', () => {
    return request(app.getHttpServer())
      .get('/system/ready')
      .expect(200)
      .expect({
        name: 'codex-monorep-template-api',
        status: 'ready',
        checks: {
          config: 'loaded',
        },
      });
  });
});
