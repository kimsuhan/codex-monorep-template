import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';
import {
  applyCheckboxInteraction,
  applyTemplateIdentity,
  buildBootstrapPrompt,
  buildCodexExecCommand,
  createOptionalSkillSelectionState,
  deriveProjectIdentity,
  generateBootstrapArtifacts,
  parseCliArguments,
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

test('parseCliArguments reads flags for bootstrap orchestration', () => {
  assert.deepEqual(
    parseCliArguments([
      'node',
      'template-init.mjs',
      '--name=my-platform',
      '--skip-install',
      '--skip-skills',
      '--run-codex',
      '--optional-skills=ui-ux-pro-max',
      '--project-idea=Build an AI-assisted internal admin console.',
    ]),
    {
      name: 'my-platform',
      shouldInstallDependencies: false,
      shouldBootstrapSkills: false,
      shouldRunCodex: true,
      optionalSkills: ['ui-ux-pro-max'],
      projectIdea: 'Build an AI-assisted internal admin console.',
    },
  );
});

test('createOptionalSkillSelectionState marks defaults as checked', () => {
  const state = createOptionalSkillSelectionState(
    [
      {
        id: 'ui-ux-pro-max',
        displayName: 'ui-ux-pro-max',
        requirement: 'optional UI exploration',
      },
      {
        id: 'another-skill',
        displayName: 'another-skill',
        requirement: 'another optional skill',
      },
    ],
    ['ui-ux-pro-max'],
  );

  assert.equal(state.cursorIndex, 0);
  assert.deepEqual(
    state.items.map(({ id, checked }) => ({ id, checked })),
    [
      { id: 'ui-ux-pro-max', checked: true },
      { id: 'another-skill', checked: false },
    ],
  );
});

test('applyCheckboxInteraction supports arrow navigation and space toggle', () => {
  const initialState = createOptionalSkillSelectionState(
    [
      {
        id: 'ui-ux-pro-max',
        displayName: 'ui-ux-pro-max',
        requirement: 'optional UI exploration',
      },
      {
        id: 'another-skill',
        displayName: 'another-skill',
        requirement: 'another optional skill',
      },
    ],
    [],
  );
  const movedState = applyCheckboxInteraction(initialState, 'down');
  const toggledState = applyCheckboxInteraction(movedState, 'toggle');

  assert.equal(movedState.cursorIndex, 1);
  assert.deepEqual(
    toggledState.items.map(({ id, checked }) => ({ id, checked })),
    [
      { id: 'ui-ux-pro-max', checked: false },
      { id: 'another-skill', checked: true },
    ],
  );
});

test('buildBootstrapPrompt includes required skills and selected optional skills', () => {
  const prompt = buildBootstrapPrompt(
    `# Bootstrap
Project: {{PROJECT_NAME}}
Required:
{{REQUIRED_SKILLS}}
Optional:
{{OPTIONAL_SKILLS}}
Skill mode: {{SKILL_BOOTSTRAP_MODE}}
Brief: {{PROJECT_BRIEF_PATH}}
Idea mode: {{PROJECT_IDEA_MODE}}
Idea:
{{PROJECT_IDEA}}
`,
    {
      projectName: 'my-platform',
      projectBriefPath: 'docs/plans/2026-03-13-my-platform.md',
      shouldBootstrapSkills: true,
      projectIdea:
        'Build an AI-assisted internal admin console for operations teams.',
      shouldAskForProjectIdea: false,
      requiredSkills: [
        {
          id: 'superpowers',
          displayName: 'superpowers',
          requirement: 'required workflow skill',
          installSummary: 'Install from obra/superpowers.',
        },
      ],
      optionalSkills: [
        {
          id: 'ui-ux-pro-max',
          displayName: 'ui-ux-pro-max',
          requirement: 'optional UI exploration',
          installSummary: 'Install from nextlevelbuilder/ui-ux-pro-max-skill.',
        },
      ],
    },
  );

  assert.match(prompt, /Project: my-platform/);
  assert.match(prompt, /- `superpowers`/);
  assert.match(prompt, /- `ui-ux-pro-max`/);
  assert.match(prompt, /verify, install, and report/);
  assert.match(prompt, /docs\/plans\/2026-03-13-my-platform.md/);
  assert.match(prompt, /use the captured idea below as source material/);
  assert.match(
    prompt,
    /Build an AI-assisted internal admin console for operations teams\./,
  );
});

test('buildBootstrapPrompt switches to ask-first mode when project idea is missing', () => {
  const prompt = buildBootstrapPrompt(
    `Idea mode: {{PROJECT_IDEA_MODE}}
Idea:
{{PROJECT_IDEA}}
`,
    {
      projectName: 'my-platform',
      projectBriefPath: 'docs/plans/2026-03-13-my-platform.md',
      shouldBootstrapSkills: true,
      projectIdea: '',
      shouldAskForProjectIdea: true,
      requiredSkills: [],
      optionalSkills: [],
    },
  );

  assert.match(
    prompt,
    /ask the user what they want to build before writing the brief/,
  );
  assert.match(prompt, /No product idea was captured during bootstrap\./);
});

test('buildCodexExecCommand returns stdin-driven fallback command', () => {
  assert.equal(
    buildCodexExecCommand('/workspace/project', '/workspace/project/.codex/bootstrap/init.prompt.md'),
    'codex exec --cd "/workspace/project" - < "/workspace/project/.codex/bootstrap/init.prompt.md"',
  );
});

test('generateBootstrapArtifacts writes prompt and manifest', async () => {
  const workspacePath = await mkdtemp(path.join(tmpdir(), 'template-init-bootstrap-'));
  const docsInitPath = path.join(workspacePath, 'docs/init');

  await mkdir(docsInitPath, { recursive: true });
  await writeFile(
    path.join(docsInitPath, 'codex-bootstrap-template.md'),
    `Project: {{PROJECT_NAME}}
Required:
{{REQUIRED_SKILLS}}
Optional:
{{OPTIONAL_SKILLS}}
Mode: {{SKILL_BOOTSTRAP_MODE}}
Brief: {{PROJECT_BRIEF_PATH}}
Idea mode: {{PROJECT_IDEA_MODE}}
Idea:
{{PROJECT_IDEA}}
`,
  );

  const result = await generateBootstrapArtifacts(workspacePath, {
    projectName: 'my-platform',
    projectBriefPath: 'docs/plans/2026-03-13-my-platform.md',
    shouldInstallDependencies: false,
    shouldBootstrapSkills: true,
    shouldRunCodex: false,
    projectIdea: 'A B2B dashboard for team analytics.',
    shouldAskForProjectIdea: false,
    requiredSkills: [
      {
        id: 'superpowers',
        displayName: 'superpowers',
        requirement: 'required workflow skill',
        installSummary: 'Install from obra/superpowers.',
      },
    ],
    optionalSkills: [],
  });

  const promptContents = await readFile(result.promptPath, 'utf8');
  const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8'));

  assert.match(promptContents, /my-platform/);
  assert.match(promptContents, /superpowers/);
  assert.deepEqual(manifest, {
    projectName: 'my-platform',
    projectBriefPath: 'docs/plans/2026-03-13-my-platform.md',
    shouldInstallDependencies: false,
    shouldBootstrapSkills: true,
    shouldRunCodex: false,
    projectIdea: 'A B2B dashboard for team analytics.',
    shouldAskForProjectIdea: false,
    requiredSkills: ['superpowers'],
    optionalSkills: [],
  });
});

test('cli falls back to manual codex command when codex is unavailable', async () => {
  const workspacePath = await mkdtemp(path.join(tmpdir(), 'template-init-cli-'));
  const rootPackagePath = path.join(workspacePath, 'package.json');
  const apiPackagePath = path.join(workspacePath, 'apps/api/package.json');
  const webPackagePath = path.join(workspacePath, 'apps/web/package.json');
  const readmePath = path.join(workspacePath, 'README.md');
  const docsInitPath = path.join(workspacePath, 'docs/init');

  await mkdir(path.dirname(apiPackagePath), { recursive: true });
  await mkdir(path.dirname(webPackagePath), { recursive: true });
  await mkdir(docsInitPath, { recursive: true });

  await writeFile(
    rootPackagePath,
    JSON.stringify({ name: 'codex-monorep-template' }, null, 2),
  );
  await writeFile(apiPackagePath, JSON.stringify({ name: 'api' }, null, 2));
  await writeFile(webPackagePath, JSON.stringify({ name: 'web' }, null, 2));
  await writeFile(readmePath, '# codex-monorep-template\n');
  await writeFile(
    path.join(workspacePath, '.gitignore'),
    'node_modules\n',
  );
  await writeFile(
    path.join(docsInitPath, 'codex-bootstrap-template.md'),
    `Project: {{PROJECT_NAME}}
Required:
{{REQUIRED_SKILLS}}
Optional:
{{OPTIONAL_SKILLS}}
Mode: {{SKILL_BOOTSTRAP_MODE}}
Brief: {{PROJECT_BRIEF_PATH}}
Idea mode: {{PROJECT_IDEA_MODE}}
Idea:
{{PROJECT_IDEA}}
`,
  );

  const output = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(
          '/Users/kim/Dev/n_workspace/00_suhan/codex-monorep-template/tooling/scripts',
          'template-init.mjs',
        ),
        '--name=my-platform',
        '--skip-install',
        '--run-codex',
        '--optional-skills=ui-ux-pro-max',
        '--project-idea=Build an onboarding workflow for internal operations.',
      ],
      {
        cwd: workspacePath,
        env: {
          ...process.env,
          CODEX_BIN: 'codex-does-not-exist',
        },
      },
    );

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Unexpected exit ${code}: ${stderr}`));
        return;
      }

      resolve(stdout);
    });
  });

  assert.match(output, /Template initialized for My Platform/);
  assert.match(output, /Codex autorun skipped: `codex` CLI not found\./);
  assert.match(output, /codex exec --cd/);
  assert.match(
    await readFile(
      path.join(workspacePath, '.codex/bootstrap/init.prompt.md'),
      'utf8',
    ),
    /ui-ux-pro-max/,
  );
  assert.match(
    await readFile(
      path.join(workspacePath, '.codex/bootstrap/init.config.json'),
      'utf8',
    ),
    /Build an onboarding workflow for internal operations\./,
  );
});

test('cli generates ask-first bootstrap mode when no project idea was provided', async () => {
  const workspacePath = await mkdtemp(
    path.join(tmpdir(), 'template-init-cli-no-idea-'),
  );
  const rootPackagePath = path.join(workspacePath, 'package.json');
  const apiPackagePath = path.join(workspacePath, 'apps/api/package.json');
  const webPackagePath = path.join(workspacePath, 'apps/web/package.json');
  const readmePath = path.join(workspacePath, 'README.md');
  const docsInitPath = path.join(workspacePath, 'docs/init');

  await mkdir(path.dirname(apiPackagePath), { recursive: true });
  await mkdir(path.dirname(webPackagePath), { recursive: true });
  await mkdir(docsInitPath, { recursive: true });

  await writeFile(
    rootPackagePath,
    JSON.stringify({ name: 'codex-monorep-template' }, null, 2),
  );
  await writeFile(apiPackagePath, JSON.stringify({ name: 'api' }, null, 2));
  await writeFile(webPackagePath, JSON.stringify({ name: 'web' }, null, 2));
  await writeFile(readmePath, '# codex-monorep-template\n');
  await writeFile(
    path.join(workspacePath, '.gitignore'),
    'node_modules\n',
  );
  await writeFile(
    path.join(docsInitPath, 'codex-bootstrap-template.md'),
    `Idea mode: {{PROJECT_IDEA_MODE}}
Idea:
{{PROJECT_IDEA}}
`,
  );

  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(
          '/Users/kim/Dev/n_workspace/00_suhan/codex-monorep-template/tooling/scripts',
          'template-init.mjs',
        ),
        '--name=my-platform',
        '--skip-install',
        '--no-run-codex',
      ],
      {
        cwd: workspacePath,
        env: {
          ...process.env,
          CODEX_BIN: 'codex-does-not-exist',
        },
      },
    );

    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Unexpected exit ${code}: ${stderr}`));
        return;
      }

      resolve();
    });
  });

  assert.match(
    await readFile(
      path.join(workspacePath, '.codex/bootstrap/init.prompt.md'),
      'utf8',
    ),
    /ask the user what they want to build before writing the brief/,
  );
  assert.match(
    await readFile(
      path.join(workspacePath, '.codex/bootstrap/init.config.json'),
      'utf8',
    ),
    /"shouldAskForProjectIdea": true/,
  );
});
