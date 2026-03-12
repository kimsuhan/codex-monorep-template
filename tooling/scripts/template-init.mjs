import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TEMPLATE_PACKAGE_NAME = 'codex-monorep-template';
const TEMPLATE_DISPLAY_NAME = 'Codex Internal Template';

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
];

const jsonPackageNames = [
  ['package.json', (packageName) => packageName],
  ['apps/api/package.json', (packageName) => `${packageName}-api`],
  ['apps/web/package.json', (packageName) => `${packageName}-web`],
];

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

function parseCliArguments(argv) {
  const [, , ...argumentsList] = argv;

  const providedName = argumentsList.find(
    (argument) => !argument.startsWith('--'),
  );
  const providedFlag = argumentsList.find((argument) =>
    argument.startsWith('--name='),
  );

  return providedName ?? providedFlag?.slice('--name='.length);
}

async function runCli() {
  const requestedName =
    parseCliArguments(process.argv) ?? path.basename(process.cwd());

  if (requestedName === TEMPLATE_PACKAGE_NAME) {
    throw new Error(
      'Provide a project name, for example: pnpm template:init --name=my-platform',
    );
  }

  const identity = deriveProjectIdentity(requestedName);
  await applyTemplateIdentity(process.cwd(), identity);

  process.stdout.write(
    `Template initialized for ${identity.displayName} (${identity.packageName}).\n`,
  );
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
