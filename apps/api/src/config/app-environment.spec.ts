import { parseAppEnvironment } from './app-environment';

describe('parseAppEnvironment', () => {
  it('returns normalized defaults for the template runtime', () => {
    expect(parseAppEnvironment({})).toEqual({
      APP_NAME: 'codex-monorep-template-api',
      LOG_LEVEL: 'log',
      NODE_ENV: 'development',
      PORT: 3000,
    });
  });

  it('throws when PORT is not a valid integer', () => {
    expect(() => parseAppEnvironment({ PORT: 'nope' })).toThrow(
      'Invalid application environment variables',
    );
  });
});
