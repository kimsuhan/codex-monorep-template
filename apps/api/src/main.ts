import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { parseAppEnvironment } from './config/app-environment';
import { resolveLogLevels } from './config/logger';

async function bootstrap() {
  const environment = parseAppEnvironment(process.env);
  const app = await NestFactory.create(AppModule, {
    logger: resolveLogLevels(environment.LOG_LEVEL),
  });
  const bootstrapLogger = new Logger('Bootstrap');

  app.enableShutdownHooks();
  await app.listen(environment.PORT);

  bootstrapLogger.log(
    `${environment.APP_NAME} listening on port ${environment.PORT}`,
  );
}

void bootstrap();
