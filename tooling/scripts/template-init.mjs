import { createReadStream } from 'node:fs';
import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { spawn, spawnSync } from 'node:child_process';
import { stdin as input, stdout as output } from 'node:process';
import { pathToFileURL } from 'node:url';
import {
  bootstrapManifestPath,
  bootstrapPromptPath,
  bootstrapTemplatePath,
  optionalSkillIds,
  optionalSkills,
  requiredSkills,
} from './template-bootstrap-config.mjs';

const TEMPLATE_PACKAGE_NAME = 'codex-monorep-template';
const TEMPLATE_DISPLAY_NAME = 'Codex Internal Template';
const projectBriefTemplatePath = 'docs/plans/templates/project-brief.md';

const textReplacementPaths = [
  'README.md',
  'AGENTS.md',
  'apps/api/README.md',
  'apps/api/.env.example',
  'apps/web/README.md',
  'apps/web/.env.example',
  'docs/onboarding.md',
  'docs/monorepo.md',
  'docs/contributing.md',
  'docs/release-and-ops.md',
  'docs/template-usage.md',
  'docs/init/README.md',
  'docs/init/codex-bootstrap-template.md',
];

const jsonPackageNames = [
  ['package.json', (packageName) => packageName],
  ['apps/api/package.json', (packageName) => `${packageName}-api`],
  ['apps/web/package.json', (packageName) => `${packageName}-web`],
];

const DEFAULT_SHOULD_INSTALL_DEPENDENCIES = true;
const DEFAULT_SHOULD_BOOTSTRAP_SKILLS = true;
const DEFAULT_SHOULD_RUN_CODEX = false;
const CODEX_SANDBOX_MODE = 'workspace-write';
const MISSING_PROJECT_IDEA_MESSAGE =
  'No product idea was captured during bootstrap.';
const MISSING_PROJECT_IDEA_PLACEHOLDER =
  'To be provided during Codex brief refinement.';
const BRIEF_PLACEHOLDER = 'To be refined during Codex brief refinement.';
const BRIEF_OPEN_QUESTIONS_PLACEHOLDER =
  'Specific users, workflow details, and success criteria still need validation.';

export function deriveProjectIdentity(inputName) {
  const packageName = inputName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!packageName) {
    throw new Error('Unable to derive a package name from the provided input.');
  }

  return {
    displayName: packageName
      .split('-')
      .filter(Boolean)
      .map((segment) => segment[0].toUpperCase() + segment.slice(1))
      .join(' '),
    packageName,
    title: packageName,
  };
}

function replaceTemplateTokens(fileContents, identity) {
  return fileContents
    .replaceAll(`${TEMPLATE_PACKAGE_NAME}-api`, `${identity.packageName}-api`)
    .replaceAll(`${TEMPLATE_PACKAGE_NAME}-web`, `${identity.packageName}-web`)
    .replaceAll(TEMPLATE_PACKAGE_NAME, identity.title)
    .replaceAll(TEMPLATE_DISPLAY_NAME, identity.displayName);
}

export async function applyTemplateIdentity(workspacePath, identity) {
  await Promise.all(
    jsonPackageNames.map(async ([relativePath, packageNameFactory]) => {
      const absolutePath = path.join(workspacePath, relativePath);
      const fileContents = await readFile(absolutePath, 'utf8');
      const packageJson = JSON.parse(fileContents);

      packageJson.name = packageNameFactory(identity.packageName);

      await writeFile(
        absolutePath,
        `${JSON.stringify(packageJson, null, 2)}\n`,
      );
    }),
  );

  await Promise.all(
    textReplacementPaths.map(async (relativePath) => {
      const absolutePath = path.join(workspacePath, relativePath);
      try {
        const fileContents = await readFile(absolutePath, 'utf8');
        const nextFileContents = replaceTemplateTokens(fileContents, identity);

        if (nextFileContents !== fileContents) {
          await writeFile(absolutePath, nextFileContents);
        }
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !('code' in error) ||
          error.code !== 'ENOENT'
        ) {
          throw error;
        }
      }
    }),
  );
}

function parseOptionalSkills(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((skillId) => skillId.trim())
    .filter(Boolean);
}

function assertKnownOptionalSkills(skillIds) {
  const invalidSkillIds = skillIds.filter(
    (skillId) => !optionalSkillIds.includes(skillId),
  );

  if (invalidSkillIds.length > 0) {
    throw new Error(
      `Unknown optional skills: ${invalidSkillIds.join(', ')}. Supported values: ${optionalSkillIds.join(', ')}`,
    );
  }
}

export function createOptionalSkillSelectionState(
  skills,
  selectedSkillIds = [],
) {
  return {
    cursorIndex: 0,
    items: skills.map((skill) => ({
      ...skill,
      checked: selectedSkillIds.includes(skill.id),
    })),
  };
}

export function applyCheckboxInteraction(state, action) {
  if (state.items.length === 0) {
    return state;
  }

  if (action === 'up') {
    return {
      ...state,
      cursorIndex:
        (state.cursorIndex - 1 + state.items.length) % state.items.length,
    };
  }

  if (action === 'down') {
    return {
      ...state,
      cursorIndex: (state.cursorIndex + 1) % state.items.length,
    };
  }

  if (action === 'toggle') {
    return {
      ...state,
      items: state.items.map((item, index) =>
        index === state.cursorIndex
          ? { ...item, checked: !item.checked }
          : item,
      ),
    };
  }

  return state;
}

function renderOptionalSkillSelection(state) {
  return [
    'Optional Codex skills',
    'Use ↑/↓ to move, space to toggle, enter to confirm.',
    ...state.items.map((item, index) => {
      const cursor = index === state.cursorIndex ? '>' : ' ';
      const checkbox = item.checked ? 'x' : ' ';

      return `${cursor} [${checkbox}] ${item.id} - ${item.requirement}`;
    }),
  ].join('\n');
}

async function askOptionalSkillSelectionWithCheckboxes() {
  if (optionalSkills.length === 0) {
    return [];
  }

  if (
    !input.isTTY ||
    !output.isTTY ||
    typeof input.setRawMode !== 'function'
  ) {
    return null;
  }

  let state = createOptionalSkillSelectionState(optionalSkills);
  const renderedLineCount = state.items.length + 2;
  const previousRawMode = input.isRaw;

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      input.off('data', handleKeypress);

      if (!previousRawMode) {
        input.setRawMode(false);
      }

      input.pause();
      output.write('\x1b[?25h');
      output.write('\n');
    };

    const rerender = () => {
      output.write(`\x1b[${renderedLineCount}F`);
      output.write('\x1b[J');
      output.write(renderOptionalSkillSelection(state));
    };

    const finish = () => {
      const selectedSkillIds = state.items
        .filter((item) => item.checked)
        .map((item) => item.id);

      cleanup();
      resolve(selectedSkillIds);
    };

    const fail = (error) => {
      cleanup();
      reject(error);
    };

    const handleKeypress = (chunk) => {
      const key = chunk.toString('utf8');

      if (key === '\u0003') {
        fail(new Error('Bootstrap cancelled.'));
        return;
      }

      if (key === '\r' || key === '\n') {
        finish();
        return;
      }

      if (key === ' ') {
        state = applyCheckboxInteraction(state, 'toggle');
        rerender();
        return;
      }

      if (key === '\u001b[A') {
        state = applyCheckboxInteraction(state, 'up');
        rerender();
        return;
      }

      if (key === '\u001b[B') {
        state = applyCheckboxInteraction(state, 'down');
        rerender();
      }
    };

    output.write('\x1b[?25l');
    output.write(`${renderOptionalSkillSelection(state)}\n`);

    if (!previousRawMode) {
      input.setRawMode(true);
    }

    input.resume();
    input.on('data', handleKeypress);
  });
}

export function parseCliArguments(argv) {
  const [, , ...argumentsList] = argv;
  const parsed = {
    name: undefined,
    shouldInstallDependencies: undefined,
    shouldBootstrapSkills: undefined,
    shouldRunCodex: undefined,
    optionalSkills: undefined,
    projectIdea: undefined,
  };

  for (const argument of argumentsList) {
    if (argument.startsWith('--name=')) {
      parsed.name = argument.slice('--name='.length);
      continue;
    }

    if (!argument.startsWith('--') && !parsed.name) {
      parsed.name = argument;
      continue;
    }

    if (argument === '--skip-install') {
      parsed.shouldInstallDependencies = false;
      continue;
    }

    if (argument === '--skip-skills') {
      parsed.shouldBootstrapSkills = false;
      continue;
    }

    if (argument === '--run-codex') {
      parsed.shouldRunCodex = true;
      continue;
    }

    if (argument === '--no-run-codex') {
      parsed.shouldRunCodex = false;
      continue;
    }

    if (argument.startsWith('--optional-skills=')) {
      parsed.optionalSkills = parseOptionalSkills(
        argument.slice('--optional-skills='.length),
      );
      continue;
    }

    if (argument.startsWith('--project-idea=')) {
      parsed.projectIdea = argument.slice('--project-idea='.length).trim();
    }
  }

  if (parsed.optionalSkills) {
    assertKnownOptionalSkills(parsed.optionalSkills);
  }

  return parsed;
}

function formatSkillList(skills, emptyMessage) {
  if (skills.length === 0) {
    return emptyMessage;
  }

  return skills
    .map(
      (skill) =>
        `- \`${skill.displayName}\`: ${skill.requirement}. ${skill.installSummary}`,
    )
    .join('\n');
}

export function buildBootstrapPrompt(templateContents, configuration) {
  const requiredSkillsBlock = formatSkillList(
    configuration.requiredSkills,
    '- No required skills configured.',
  );
  const optionalSkillsBlock = formatSkillList(
    configuration.optionalSkills,
    '- No optional skills were selected for this bootstrap run.',
  );
  const skillBootstrapMode = configuration.shouldBootstrapSkills
    ? 'verify, install, and report the listed skills before moving on'
    : 'verify the listed skills, report anything missing, and do not install anything automatically';
  const projectIdeaMode = configuration.shouldAskForProjectIdea
    ? 'ask the user what they want to build before refining the existing brief'
    : 'use the captured idea below as source material to verify and refine the existing brief';
  const projectIdea = configuration.projectIdea?.trim()
    ? configuration.projectIdea.trim()
    : MISSING_PROJECT_IDEA_MESSAGE;

  return templateContents
    .replaceAll('{{PROJECT_NAME}}', configuration.projectName)
    .replaceAll('{{PROJECT_BRIEF_PATH}}', configuration.projectBriefPath)
    .replaceAll('{{REQUIRED_SKILLS}}', requiredSkillsBlock)
    .replaceAll('{{OPTIONAL_SKILLS}}', optionalSkillsBlock)
    .replaceAll('{{SKILL_BOOTSTRAP_MODE}}', skillBootstrapMode)
    .replaceAll('{{PROJECT_IDEA_MODE}}', projectIdeaMode)
    .replaceAll('{{PROJECT_IDEA}}', projectIdea);
}

export function buildCodexExecCommand(workspacePath, promptPath) {
  const escapedWorkspacePath = workspacePath.replaceAll('"', '\\"');
  const escapedPromptPath = promptPath.replaceAll('"', '\\"');

  return `codex exec --sandbox ${CODEX_SANDBOX_MODE} --cd "${escapedWorkspacePath}" - < "${escapedPromptPath}"`;
}

export async function generateBootstrapArtifacts(workspacePath, configuration) {
  const templatePath = path.join(workspacePath, bootstrapTemplatePath);
  const promptTemplate = await readFile(templatePath, 'utf8');
  const promptPath = path.join(workspacePath, bootstrapPromptPath);
  const manifestPath = path.join(workspacePath, bootstrapManifestPath);

  await mkdir(path.dirname(promptPath), { recursive: true });

  const promptContents = buildBootstrapPrompt(promptTemplate, configuration);
  const manifest = {
    projectName: configuration.projectName,
    projectBriefPath: configuration.projectBriefPath,
    codexSandboxMode: CODEX_SANDBOX_MODE,
    shouldInstallDependencies: configuration.shouldInstallDependencies,
    shouldBootstrapSkills: configuration.shouldBootstrapSkills,
    shouldRunCodex: configuration.shouldRunCodex,
    projectIdea: configuration.projectIdea,
    shouldAskForProjectIdea: configuration.shouldAskForProjectIdea,
    requiredSkills: configuration.requiredSkills.map((skill) => skill.id),
    optionalSkills: configuration.optionalSkills.map((skill) => skill.id),
  };

  await writeFile(promptPath, `${promptContents.trim()}\n`);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    promptPath,
    manifestPath,
  };
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatInlineValue(value) {
  return value
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n  ');
}

function replaceLine(templateContents, linePrefix, nextValue) {
  const pattern = new RegExp(`^${escapeRegExp(linePrefix)}.*$`, 'm');
  return templateContents.replace(pattern, `${linePrefix}${nextValue}`);
}

function buildDraftSections(projectIdea) {
  const normalizedIdea = projectIdea.trim();

  if (!normalizedIdea) {
    return {
      sourceIdea: MISSING_PROJECT_IDEA_PLACEHOLDER,
      problem: [
        BRIEF_PLACEHOLDER,
        'Why this matters now: To be refined.',
      ],
      targetUsers: [
        BRIEF_PLACEHOLDER,
        'Usage context: To be refined.',
      ],
      goals: [
        BRIEF_PLACEHOLDER,
        'Secondary goals: To be refined.',
      ],
      nonGoals: BRIEF_PLACEHOLDER,
      coreUserFlow: [
        BRIEF_PLACEHOLDER,
        'To be refined.',
        'To be refined.',
      ],
      successMetrics: BRIEF_PLACEHOLDER,
      openQuestions: BRIEF_OPEN_QUESTIONS_PLACEHOLDER,
    };
  }

  const conciseIdea = normalizedIdea
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');

  return {
    sourceIdea: normalizedIdea,
    problem: [
      `Turn "${conciseIdea}" into a concrete first product direction instead of leaving the workflow implicit.`,
      'Why this matters now: The team needs an actionable brief before implementation starts.',
    ],
    targetUsers: [
      'Teams and operators directly involved in the workflow described in the source idea.',
      'Usage context: They are trying to complete that workflow with less manual coordination and clearer system support.',
    ],
    goals: [
      `Define a first implementation-ready scope for "${conciseIdea}".`,
      'Secondary goals: Clarify assumptions, expected outcomes, and the minimum useful first release.',
    ],
    nonGoals:
      'Adjacent workflows, broad platform expansion, and deeper automation not required for the first release.',
    coreUserFlow: [
      'A target user enters the product to start the workflow described in the source idea.',
      'They complete the central action the product is meant to support.',
      'They reach the intended outcome with less friction and a clearer system record.',
    ],
    successMetrics:
      'Stakeholders align on scope, early users can complete the core workflow, and the team can move into implementation planning without major ambiguity.',
    openQuestions:
      'Which user segment matters most first, what constraints or integrations are required, and what success threshold defines a strong first release?',
  };
}

export function buildInitialProjectBrief(templateContents, configuration) {
  const sections = buildDraftSections(configuration.projectIdea ?? '');

  let briefContents = templateContents;
  briefContents = replaceLine(
    briefContents,
    '- Project or initiative:',
    ` ${configuration.projectName}`,
  );
  briefContents = replaceLine(briefContents, '- Owner:', ' To be assigned');
  briefContents = replaceLine(
    briefContents,
    '- Date:',
    ` ${configuration.date ?? getTodayIsoDate()}`,
  );
  briefContents = replaceLine(briefContents, '- Status:', ' Draft');
  briefContents = replaceLine(
    briefContents,
    '- Original request or idea:',
    ` ${formatInlineValue(sections.sourceIdea)}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- What problem are we solving?',
    ` ${sections.problem[0]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- Why does it matter now?',
    ` ${sections.problem[1]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- Who is this for?',
    ` ${sections.targetUsers[0]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- What context are they in when they use it?',
    ` ${sections.targetUsers[1]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- Primary goal:',
    ` ${sections.goals[0]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- Secondary goals:',
    ` ${sections.goals[1]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- What is explicitly out of scope for this phase?',
    ` ${sections.nonGoals}`,
  );
  briefContents = replaceLine(
    briefContents,
    '1. Entry point:',
    ` ${sections.coreUserFlow[0]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '2. Key action:',
    ` ${sections.coreUserFlow[1]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '3. Expected outcome:',
    ` ${sections.coreUserFlow[2]}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- What signals will tell us this is working?',
    ` ${sections.successMetrics}`,
  );
  briefContents = replaceLine(
    briefContents,
    '- What still needs validation or a product decision?',
    ` ${sections.openQuestions}`,
  );

  return `${briefContents.trim()}\n`;
}

export async function writeInitialProjectBrief(workspacePath, configuration) {
  const templatePath = path.join(workspacePath, projectBriefTemplatePath);
  const targetPath = path.join(workspacePath, configuration.projectBriefPath);
  const templateContents = await readFile(templatePath, 'utf8');
  const briefContents = buildInitialProjectBrief(templateContents, {
    projectName: configuration.projectName,
    projectIdea: configuration.projectIdea,
    date: configuration.date,
  });

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, briefContents);

  return {
    briefPath: targetPath,
  };
}

function detectCodexBinary() {
  const requestedBinary = process.env.CODEX_BIN ?? 'codex';
  const result = spawnSync('which', [requestedBinary], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return null;
  }

  return result.stdout.trim() || requestedBinary;
}

function runCommand(command, argumentsList, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, argumentsList, {
      cwd: options.cwd,
      env: options.env,
      stdio: options.stdio ?? 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} ${argumentsList.join(' ')} exited with code ${code}.`,
        ),
      );
    });
  });
}

async function runCodexBootstrap(codexBinary, workspacePath, promptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      codexBinary,
      ['exec', '--sandbox', CODEX_SANDBOX_MODE, '--cd', workspacePath, '-'],
      {
        cwd: workspacePath,
        stdio: ['pipe', 'inherit', 'inherit'],
      },
    );

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Codex bootstrap exited with code ${code}.`));
    });

    createReadStream(promptPath)
      .on('error', reject)
      .pipe(child.stdin);
  });
}

async function askQuestion(rl, question, defaultValue) {
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  const response = (await rl.question(`${question}${suffix}: `)).trim();

  return response || defaultValue;
}

async function askMultilineQuestion(rl, question) {
  output.write(`${question}\n`);
  output.write('Press enter on an empty line to finish.\n');

  const lines = [];

  while (true) {
    const line = await rl.question('> ');

    if (line.trim().length === 0) {
      break;
    }

    lines.push(line);
  }

  return lines.join('\n').trim();
}

async function askBooleanQuestion(rl, question, defaultValue) {
  const defaultLabel = defaultValue ? 'Y/n' : 'y/N';

  while (true) {
    const response = (
      await rl.question(`${question} [${defaultLabel}]: `)
    )
      .trim()
      .toLowerCase();

    if (!response) {
      return defaultValue;
    }

    if (['y', 'yes'].includes(response)) {
      return true;
    }

    if (['n', 'no'].includes(response)) {
      return false;
    }

    output.write('Please answer with y or n.\n');
  }
}

async function askOptionalSkillSelection(rl) {
  if (optionalSkills.length === 0) {
    return [];
  }

  let checkboxSelection;

  rl.pause();
  try {
    checkboxSelection = await askOptionalSkillSelectionWithCheckboxes();
  } finally {
    rl.resume();
  }

  if (checkboxSelection) {
    return checkboxSelection;
  }

  output.write('Optional Codex skills:\n');
  optionalSkills.forEach((skill) => {
    output.write(`- ${skill.id}: ${skill.requirement}\n`);
  });

  const response = await askQuestion(
    rl,
    'Select optional skills by comma-separated id, or leave blank for none',
    '',
  );
  const selectedOptionalSkills = parseOptionalSkills(response);

  assertKnownOptionalSkills(selectedOptionalSkills);

  return selectedOptionalSkills;
}

async function collectBootstrapAnswers(parsedArguments, workspacePath) {
  const isInteractive = Boolean(input.isTTY && output.isTTY);
  const codexBinary = detectCodexBinary();
  const currentDirectoryName = path.basename(workspacePath);

  const answers = {
    name: parsedArguments.name,
    shouldInstallDependencies: parsedArguments.shouldInstallDependencies,
    shouldBootstrapSkills: parsedArguments.shouldBootstrapSkills,
    shouldRunCodex: parsedArguments.shouldRunCodex,
    optionalSkills: parsedArguments.optionalSkills,
    projectIdea: parsedArguments.projectIdea,
    codexBinary,
  };

  if (!answers.name && currentDirectoryName !== TEMPLATE_PACKAGE_NAME) {
    answers.name = currentDirectoryName;
  }

  if (!isInteractive) {
    answers.shouldInstallDependencies ??= DEFAULT_SHOULD_INSTALL_DEPENDENCIES;
    answers.shouldBootstrapSkills ??= DEFAULT_SHOULD_BOOTSTRAP_SKILLS;
    answers.optionalSkills ??= [];
    answers.shouldRunCodex ??= DEFAULT_SHOULD_RUN_CODEX;

    return answers;
  }

  const rl = readline.createInterface({ input, output });

  try {
    if (!answers.name) {
      answers.name = await askQuestion(
        rl,
        'Project name',
        currentDirectoryName === TEMPLATE_PACKAGE_NAME
          ? ''
          : currentDirectoryName,
      );
    }

    answers.shouldInstallDependencies ??= await askBooleanQuestion(
      rl,
      'Run pnpm install now',
      DEFAULT_SHOULD_INSTALL_DEPENDENCIES,
    );

    answers.shouldBootstrapSkills ??= await askBooleanQuestion(
      rl,
      'Prepare Codex skill bootstrap now',
      DEFAULT_SHOULD_BOOTSTRAP_SKILLS,
    );

    if (answers.shouldBootstrapSkills) {
      answers.optionalSkills ??= await askOptionalSkillSelection(rl);
    } else {
      answers.optionalSkills ??= [];
    }

    if (answers.projectIdea === undefined) {
      answers.projectIdea = await askMultilineQuestion(
        rl,
        'What do you want to build?',
      );
    }

    if (answers.shouldRunCodex === undefined) {
      answers.shouldRunCodex = codexBinary
        ? await askBooleanQuestion(
            rl,
            'Run Codex bootstrap automatically after files are prepared',
            true,
          )
        : false;
    }

    return answers;
  } finally {
    rl.close();
  }
}

function buildProjectBriefPath(projectName) {
  const today = getTodayIsoDate();
  return `docs/plans/${today}-${projectName}.md`;
}

function resolveOptionalSkills(skillIds) {
  return optionalSkills.filter((skill) => skillIds.includes(skill.id));
}

async function printFallbackInstructions(reason, promptPath, workspacePath) {
  output.write(`\nCodex autorun skipped: ${reason}\n`);
  output.write(`Prompt file: ${promptPath}\n`);
  output.write(
    `Run this command when you are ready:\n${buildCodexExecCommand(workspacePath, promptPath)}\n`,
  );
}

async function runCli() {
  const workspacePath = process.cwd();
  const parsedArguments = parseCliArguments(process.argv);
  const answers = await collectBootstrapAnswers(parsedArguments, workspacePath);

  if (!answers.name || answers.name === TEMPLATE_PACKAGE_NAME) {
    throw new Error(
      'Provide a project name, for example: pnpm template:init --name=my-platform',
    );
  }

  const identity = deriveProjectIdentity(answers.name);

  await applyTemplateIdentity(workspacePath, identity);

  if (answers.shouldInstallDependencies) {
    output.write('\nInstalling workspace dependencies with pnpm...\n');
    await runCommand('pnpm', ['install'], { cwd: workspacePath });
  }

  const bootstrapConfiguration = {
    projectName: identity.packageName,
    projectBriefPath: buildProjectBriefPath(identity.packageName),
    shouldInstallDependencies: answers.shouldInstallDependencies,
    shouldBootstrapSkills: answers.shouldBootstrapSkills,
    shouldRunCodex: answers.shouldRunCodex,
    projectIdea: answers.projectIdea ?? '',
    shouldAskForProjectIdea: !(answers.projectIdea ?? '').trim(),
    requiredSkills,
    optionalSkills: resolveOptionalSkills(answers.optionalSkills),
  };
  const artifacts = await generateBootstrapArtifacts(
    workspacePath,
    bootstrapConfiguration,
  );
  const brief = await writeInitialProjectBrief(workspacePath, {
    projectName: identity.packageName,
    projectBriefPath: bootstrapConfiguration.projectBriefPath,
    projectIdea: answers.projectIdea ?? '',
  });

  output.write(
    `Template initialized for ${identity.displayName} (${identity.packageName}).\n`,
  );
  output.write(`Project brief: ${brief.briefPath}\n`);
  output.write(`Bootstrap prompt: ${artifacts.promptPath}\n`);
  output.write(`Bootstrap manifest: ${artifacts.manifestPath}\n`);

  if (!answers.shouldRunCodex) {
    await printFallbackInstructions(
      'autorun not requested.',
      artifacts.promptPath,
      workspacePath,
    );
    return;
  }

  if (!answers.codexBinary) {
    await printFallbackInstructions(
      '`codex` CLI not found.',
      artifacts.promptPath,
      workspacePath,
    );
    return;
  }

  output.write('\nRunning Codex bootstrap...\n');

  try {
    await runCodexBootstrap(
      answers.codexBinary,
      workspacePath,
      artifacts.promptPath,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    await printFallbackInstructions(
      `${message} Use the generated prompt manually.`,
      artifacts.promptPath,
      workspacePath,
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  runCli().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
