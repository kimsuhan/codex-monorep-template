import { LogLevel } from '@nestjs/common';
import { AppEnvironment } from './app-environment';

const logLevelsByVerbosity: Record<AppEnvironment['LOG_LEVEL'], LogLevel[]> = {
  error: ['error'],
  warn: ['error', 'warn'],
  log: ['error', 'warn', 'log'],
  debug: ['error', 'warn', 'log', 'debug'],
  verbose: ['error', 'warn', 'log', 'debug', 'verbose'],
};

export function resolveLogLevels(level: AppEnvironment['LOG_LEVEL']) {
  return logLevelsByVerbosity[level];
}
