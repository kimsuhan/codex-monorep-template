import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  applyTemplateIdentity,
  deriveProjectIdentity,
} from './template-init.mjs';

test('deriveProjectIdentity normalizes slug and display name', () => {
  assert.deepEqual(deriveProjectIdentity('internal-platform'), {
    displayName: 'Internal Platform',
    packageName: 'internal-platform',
    title: 'internal-platform',
  });
});

test('applyTemplateIdentity replaces the template placeholders in tracked files', async () => {
  const workspacePath = await mkdtemp(path.join(tmpdir(), 'template-init-'));
  const rootPackagePath = path.join(workspacePath, 'package.json');
  const apiPackagePath = path.join(workspacePath, 'apps/api/package.json');
  const webPackagePath = path.join(workspacePath, 'apps/web/package.json');
  const readmePath = path.join(workspacePath, 'README.md');

  await mkdir(path.dirname(apiPackagePath), { recursive: true });
  await mkdir(path.dirname(webPackagePath), { recursive: true });

  await writeFile(
    rootPackagePath,
    JSON.stringify({ name: 'codex-monorep-template' }, null, 2),
  );
  await writeFile(apiPackagePath, JSON.stringify({ name: 'api' }, null, 2));
  await writeFile(webPackagePath, JSON.stringify({ name: 'web' }, null, 2));
  await writeFile(
    readmePath,
    '# codex-monorep-template\nThis is the codex-monorep-template workspace.\n',
  );

  await applyTemplateIdentity(workspacePath, {
    displayName: 'Internal Platform',
    packageName: 'internal-platform',
    title: 'internal-platform',
  });

  assert.match(await readFile(rootPackagePath, 'utf8'), /"internal-platform"/);
  assert.match(
    await readFile(apiPackagePath, 'utf8'),
    /"internal-platform-api"/,
  );
  assert.match(
    await readFile(webPackagePath, 'utf8'),
    /"internal-platform-web"/,
  );
  assert.doesNotMatch(
    await readFile(readmePath, 'utf8'),
    /codex-monorep-template/,
  );
});
