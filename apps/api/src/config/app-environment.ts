import { config as loadEnvironmentFile } from 'dotenv';
import { z } from 'zod';

loadEnvironmentFile({ quiet: true });

const appEnvironmentSchema = z.object({
  APP_NAME: z.string().trim().min(1).default('codex-monorep-template-api'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'log', 'debug', 'verbose'])
    .default('log'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type AppEnvironment = z.infer<typeof appEnvironmentSchema>;

export function parseAppEnvironment(rawEnvironment: NodeJS.ProcessEnv) {
  const parsedEnvironment = appEnvironmentSchema.safeParse(rawEnvironment);

  if (!parsedEnvironment.success) {
    throw new Error('Invalid application environment variables');
  }

  return parsedEnvironment.data;
}
